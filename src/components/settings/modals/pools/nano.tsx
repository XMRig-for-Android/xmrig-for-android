import React from 'react';
import { Incubator } from 'react-native-ui-lib';
import { IPool, sharedStyles } from '.';
import { validateWalletAddress } from '../../../../core/utils';

const hostname = 'xmr-eu1.nanopool.org';
const port = 14444;

export const Nano:React.FC<IPool> = ({ onChange }) => {
  const [wallet, setWallet] = React.useState<string>('');
  const [worker, setWorker] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');

  React.useEffect(() => {
    const tmpWorker = worker.length > 0 ? `.${worker}` : '';
    const tmpEMail = email.length > 0 ? `/${email}` : '';

    onChange({
      hostname,
      port,
      username: `${wallet}${tmpWorker}${tmpEMail}`,
      password: 'x',
    });
  }, [wallet, worker, email]);

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
        label="Worker Name"
        value={worker}
        onChangeText={setWorker}
        floatOnFocus
        showCharCounter
        maxLength={128}
        fieldStyle={sharedStyles.withUnderline}
        hint="Worker1"
        placeholder="Worker1"
        marginB-10
      />
      <Incubator.TextField
        label="EMail"
        value={email}
        onChangeText={setEmail}
        floatOnFocus
        showCharCounter
        maxLength={128}
        fieldStyle={sharedStyles.withUnderline}
        hint="example@example.com"
        placeholder="example@example.com"
        keyboardType="email-address"
      />
    </>
  );
};
