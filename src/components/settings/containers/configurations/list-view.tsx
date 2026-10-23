import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  StyleSheet, FlatList,
} from 'react-native';
import { merge } from 'lodash/fp';
import {
  Card, ListItem, Text, View, ViewProps, Checkbox, Colors,
} from 'react-native-ui-lib';
import _ from 'lodash';
import { RootStackParamList } from '../../../../core/navigation';
import { Configuration } from '../../../../core/settings/settings.interface';

type ConfigurationsListViewProps = ViewProps & {
    configurations: Configuration[];
    onSelected: (ids: string[]) => void;
};

export const ConfigurationsListView:React.FC<ConfigurationsListViewProps> = ({
  configurations = [],
  onSelected,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [selected, setSelected] = React.useState<string[]>([]);

  React.useEffect(() => {
    const ids = new Set(configurations.map((config) => `${config.id}`));
    setSelected((current) => current.filter((id) => ids.has(id)));
  }, [configurations]);

  React.useEffect(() => onSelected(selected), [selected]);

  return (
    <Card
      enableShadow
      flex
    >
      <View>
        <FlatList
          data={configurations}
          renderItem={({ item }) => (
            <View>
              <ListItem
                onPress={() => navigation.navigate('Configuration', { id: item.id })}
              >
                <ListItem.Part marginH-10 containerStyle={merge(styles.border, { flexGrow: 1 })}>
                  <ListItem.Part column containerStyle={{ flexGrow: 1 }}>
                    <Text row grey10 text65 numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text row $textNeutralLight text90 numberOfLines={1}>
                      {_.capitalize(item.mode)}
                      {' '}
                      Mode
                    </Text>
                  </ListItem.Part>
                  <ListItem.Part column right>
                    <Checkbox
                      color={
                        selected.includes(item.id as string)
                          ? Colors.$backgroundDangerHeavy : Colors.$backgroundPrimaryHeavy
                      }
                      value={selected.includes(item.id as string)}
                      onValueChange={() => {
                        if (selected.includes(item.id as string)) {
                          setSelected((oldVal) => oldVal.filter((v) => v !== item.id));
                        } else {
                          setSelected((oldVal) => [...oldVal, item.id as string]);
                        }
                      }}
                    />
                  </ListItem.Part>
                </ListItem.Part>
              </ListItem>
            </View>
          )}
          keyExtractor={(item: Configuration) => `configution-${item.id}`}
        />
      </View>
    </Card>
  );

  /* return (
    <Card style={styles.card}>
      <Card.Content style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 5 }}>
        <ScrollView>
          {configurations.map((item) => (
            <List.Item
              key={`key-${item.id}`}
              style={{ paddingHorizontal: 0 }}
              title={item.name}
              description={`${item.mode} mode`.toUpperCase()}
              onPress={() => {
                navigation.navigate('Configuration' as never, { id: item.id } as never);
              }}
              right={() => <ListRightCheckbox item={item} />}
            />
          ))}
        </ScrollView>

        {selected.length > 0 && (
        <Card.Actions>
          <Button
            icon="delete"
            mode="contained"
            color={Colors.deepOrange900}
            onPress={() => {
              onDelete([...selected]);
              setSelected([]);
            }}
          >
            Delete
            {' '}
            {selected.length}
            {' '}
            Selected
          </Button>
        </Card.Actions>
        )}
      </Card.Content>
    </Card>
  ); */
};

const styles = StyleSheet.create({
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey50,
  },
  row: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  listSection: {
    flex: 1,
    marginBottom: 0,
  },
  card: {
    margin: 10,
    flex: 1,
  },
  title: {
    margin: 10,
  },
  input: {
    marginVertical: 10,
  },
  topActionButton: {
    marginRight: 10,
  },
});
