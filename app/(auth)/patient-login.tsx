import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Colors, Typography, Spacing } from '../../constants/Theme';
import { PatientService } from '../../lib/services/patient';
import { useAuthStore } from '../../store/useAuthStore';

const loginSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function PatientLoginScreen() {
  const router = useRouter();
  const { loginPatient } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { name: '', email: '' }
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setServerError('');
      const patient = await PatientService.login(data.name, data.email);
      loginPatient(patient);
      router.replace('/(patient)/dashboard');
    } catch (err: any) {
      setServerError('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Patient Access</Text>
            <Text style={styles.subtitle}>Enter your details to access your medical identity.</Text>
          </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Full Name"
                placeholder="e.g. Alex Johnson"
                value={value}
                onChangeText={onChange}
                autoCapitalize="words"
                error={errors.name?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Email Address"
                placeholder="alex@example.com"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
              />
            )}
          />
          
          {serverError ? <Text style={styles.errorText}>{serverError}</Text> : null}

          <Button
            title="Continue"
            onPress={handleSubmit(onSubmit)}
            isLoading={loading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: Spacing.xl,
    backgroundColor: Colors.background,
  },
  header: {
    marginTop: Spacing.xxl,
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
  },
  form: {
    gap: Spacing.sm,
  },
  submitButton: {
    marginTop: Spacing.md,
  },
  errorText: {
    ...Typography.small,
    color: Colors.error,
    marginBottom: Spacing.sm,
  },
});
