import React from 'react';
import { Incubator } from 'react-native-ui-lib';
import { IPool, sharedStyles } from '.';
import { validateWalletAddress } from '../../../../core/utils';

const hostname = 'pool.minexmr.com';
const port = 4444;

export const MineXMR:React.FC<IPool> = ({ onChange }) => {
  const [wallet, setWallet] = React.useState<string>('');
  const [difficulty, setDifficulty] = React.useState<string>('');

  React.useEffect(() => {
    onChange({
      hostname,
      port,
      username: `${wallet}${difficulty ? '+' : ''}${difficulty}`,
      password: '',
    });
  }, [wallet, difficulty]);

  return (
    <>
      <Incubator.TextField
        label="Wallet Address"
        value={wallet}
        onChangeText={setWallet}
        validate={['required', (value?: string) => validateWalletAddress(value)]}
        validationMessage={['Required', 'Wallet validation failed']}
        validateOnChange
        enableErrors
        floatOnFocus
        showCharCounter
        maxLength={128}
        fieldStyle={sharedStyles.withUnderline}
        hint="46gPyHjLPPM8HaayVyvCDcF2..."
        placeholder="46gPyHjLPPM8HaayVyvCDcF2..."
        marginB-10
        numberOfLines={1}
        textBreakStrategy="simple"
      />
      <Incubator.TextField
        label="Fixed Difficulty"
        value={difficulty}
        onChangeText={setDifficulty}
        floatOnFocus
        showCharCounter
        maxLength={128}
        fieldStyle={sharedStyles.withUnderline}
        hint="128000"
        placeholder="128000"
        keyboardType="numeric"
      />
    </>
  );
};
