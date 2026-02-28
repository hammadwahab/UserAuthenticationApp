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

type SignupScreenProps = NativeStackScreenProps<RootStackParamList, 'Signup'>;
type SignupFormValues = { name: string; email: string; password: string };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupScreen({ navigation }: SignupScreenProps) {
  const { signup } = useAuth();
  const [authError, setAuthError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [focusedField, setFocusedField] = useState<
    'name' | 'email' | 'password' | null
  >(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const handleSignup = async (data: SignupFormValues) => {
    setAuthError('');

    try {
      await signup(data);
    } catch (signupError) {
      if (signupError instanceof Error) {
        setAuthError(signupError.message);
      } else {
        Alert.alert('Signup failed', 'Please try again.');
      }
    }
  };

  const toggleEye = () => setIsPasswordVisible(visible => !visible);

  const navigateBack = () => navigation.goBack();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>

        <Controller
          control={control}
          name="name"
          rules={{ required: 'Please fill in all fields.',
             minLength: {
              value: 3,
              message: 'Name is required and must be at least 3 characters.',
            },
           }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onBlur={() => {
                onBlur();
                setFocusedField(null);
              }}
              onFocus={() => setFocusedField('name')}
              onChangeText={onChange}
              placeholder="Name"
              autoCapitalize="words"
              style={[
                styles.input,
                focusedField === 'name' ? styles.focusedInput : null,
              ]}
              placeholderTextColor="#7f8c8d"
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          rules={{
            required: 'Please fill in all fields.',
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
              required: 'Please fill in all fields.',
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

        {(errors.name || errors.email || errors.password || authError) && (
          <Text style={styles.errorText}>
            {errors.name?.message ||
              errors.email?.message ||
              errors.password?.message ||
              authError}
          </Text>
        )}

        <Pressable onPress={handleSubmit(handleSignup)} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Signup</Text>
        </Pressable>

        <Pressable onPress={navigateBack} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Login</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}