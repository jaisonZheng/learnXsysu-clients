import { useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Button, Caption, Switch, TextInput, Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import useToast from 'hooks/useToast';
import { useAppDispatch, useAppSelector } from 'data/store';
import { login, loginWithOfflineMode } from 'data/actions/auth';
import { setMockStore } from 'data/actions/root';
import { setSetting } from 'data/actions/settings';
import Styles from 'constants/Styles';
import SafeArea from 'components/SafeArea';
import Logo from 'components/Logo';
import env from 'helpers/env';
import { t } from 'helpers/i18n';
import { LoginStackParams } from './types';

type Props = NativeStackScreenProps<LoginStackParams, 'Login'>;

const Login: React.FC<Props> = ({ navigation }) => {
  const toast = useToast();

  const dispatch = useAppDispatch();
  const loggingIn = useAppSelector(state => state.auth.loggingIn);
  const graduate = useAppSelector(state => state.settings.graduate);
  const savedUsername = useAppSelector(state => state.auth.username);
  const savedPassword = useAppSelector(state => state.auth.password);

  const [username, setUsername] = useState(savedUsername ?? 'student2025');
  const [password, setPassword] = useState(savedPassword ?? 'password123');
  const passwordTextInputRef = useRef<any>(null);

  const hasCredential = savedUsername && savedPassword;

  const handleNext = () => {
    passwordTextInputRef.current?.focus();
  };

  const handleLogin = async () => {
    Keyboard.dismiss();

    if (!username) {
      toast(t('missingUsername'), 'error');
      return;
    }

    if (!password) {
      toast(t('missingPassword'), 'error');
      return;
    }

    if (username === env.DUMMY_USERNAME && password === env.DUMMY_PASSWORD) {
      dispatch(setMockStore());
      return;
    }

    // 绕过真实CAS认证，直接模拟登录成功
    // 不再连接清华大学服务器，直接在本地设置登录状态
    dispatch(
      login({
        username,
        password,
        fingerPrint: `fake-fingerprint-${Date.now()}`,
        fingerGenPrint: 'fake-genprint',
        fingerGenPrint3: 'fake-genprint3',
      }),
    );
  };

  const handleLoginWithOfflineMode = () => {
    dispatch(loginWithOfflineMode());
  };

  return (
    <SafeArea>
      <ScrollView style={Styles.flex1} contentContainerStyle={styles.root}>
        <KeyboardAvoidingView
          style={styles.inputs}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Logo iosSize={120} style={styles.logo} />
          <TextInput
            style={styles.textInput}
            label={t('usernameOrId')}
            textContentType="username"
            autoComplete="username"
            returnKeyType="next"
            keyboardType="ascii-capable"
            autoCapitalize="none"
            autoCorrect={false}
            enablesReturnKeyAutomatically
            onSubmitEditing={handleNext}
            value={username}
            onChangeText={v => setUsername(v.trim())}
          />
          <TextInput
            ref={passwordTextInputRef}
            style={styles.textInput}
            label={t('password')}
            textContentType="password"
            autoComplete="password"
            returnKeyType="done"
            keyboardType="ascii-capable"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            enablesReturnKeyAutomatically
            value={password}
            onChangeText={v => setPassword(v.trim())}
          />
          <View style={styles.switchContainer}>
            <Switch
              style={Styles.spacex1}
              value={graduate}
              onValueChange={checked => {
                dispatch(setSetting('graduate', checked));
              }}
            />
            <Text style={Styles.spacex1}>{t('graduate')}</Text>
          </View>
          <View style={styles.noteContainer}>
            <Caption style={styles.note}>{t('securityNote')}</Caption>
          </View>
          <Button
            style={styles.button}
            mode="contained"
            loading={loggingIn}
            disabled={loggingIn}
            onPress={handleLogin}
          >
            {t('login')}
          </Button>
          {hasCredential && (
            <Button
              style={styles.button}
              mode="text"
              onPress={handleLoginWithOfflineMode}
            >
              {t('offlineMode')}
            </Button>
          )}
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginBottom: Platform.OS === 'android' ? -16 : 16,
  },
  inputs: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  textInput: {
    width: '100%',
    marginVertical: 16,
  },
  button: {
    marginTop: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  noteContainer: {
    alignItems: 'center',
    width: '60%',
  },
  note: {
    textAlign: 'center',
  },
});

export default Login;
