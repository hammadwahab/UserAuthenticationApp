import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../navigation/types';
import styles from './styles';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
type LoginFormValues = { email: string; password: string };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { login } = useAuth();
  const [authError, setAuthError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(
    null,
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (data: LoginFormValues) => {
    setAuthError('');
    try {
      await login(data);
    } catch (loginError) {
      if (loginError instanceof Error) {
        setAuthError(loginError.message);
      } else {
        Alert.alert('Login failed', 'Please try again.');
      }
    }
  };

  const toggleEye = () => setIsPasswordVisible(visible => !visible);

  const navigateToSignup = () => navigation.navigate('Signup');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>

        <Controller
          control={control}
          name="email"
          rules={{
            required: 'Please enter your email.',
            pattern: {
              value: EMAIL_REGEX,
              message: 'Please enter a valid email address.',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onBlur={() => {
                onBlur();
                setFocusedField(null);
              }}
              onFocus={() => setFocusedField('email')}
              onChangeText={onChange}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              style={[
                styles.input,
                focusedField === 'email' ? styles.focusedInput : null,
              ]}
              placeholderTextColor="#7f8c8d"
            />
          )}
        />

        <View
          style={[
            styles.passwordWrapper,
            focusedField === 'password' ? styles.focusedPasswordWrapper : null,
          ]}>
          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Please enter your password.',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters.',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={value}
                onBlur={() => {
                  onBlur();
                  setFocusedField(null);
                }}
                onFocus={() => setFocusedField('password')}
                onChangeText={onChange}
                placeholder="Password"
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                style={styles.passwordInput}
                placeholderTextColor="#7f8c8d"
              />
            )}
          />
          <Pressable onPress={toggleEye} style={styles.eyeButton}>
            <Text style={styles.eyeIcon}>{isPasswordVisible ? '🙈' : '👁️'}</Text>
          </Pressable>
        </View>

        {(errors.email || errors.password || authError) && (
          <Text style={styles.errorText}>
            {errors.email?.message || errors.password?.message || authError}
          </Text>
        )}

        <Pressable onPress={handleSubmit(handleLogin)} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Login</Text>
        </Pressable>

        <Pressable onPress={navigateToSignup} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Signup</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}