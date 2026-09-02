import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import { Colors, Typography, Spacing } from '../../constants/Theme';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function SetupScreen() {
  const router = useRouter();
  const { patient, loginPatient } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleComplete = () => {
    setLoading(true);
    setTimeout(() => {
      // In MVP, we just update local state
      if (patient) {
        loginPatient({ ...patient, blood_group: 'O+' }); // Mock update
      }
      setLoading(false);
      router.replace('/(patient)/dashboard');
    }, 800);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        <Text style={styles.title}>Welcome, {patient?.name || 'Patient'}</Text>
        <Text style={styles.subtitle}>Let's set up your medical identity.</Text>

        <View style={styles.form}>
          <Input label="Blood Group" placeholder="e.g. O+, AB-" />
          <Input label="Known Allergies" placeholder="e.g. Penicillin" />
          <Input label="Emergency Contact Phone" placeholder="+1..." keyboardType="phone-pad" />
        </View>

        <Button title="Complete Setup" onPress={handleComplete} isLoading={loading} style={styles.button} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: Spacing.xl,
    backgroundColor: Colors.background,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
    marginBottom: Spacing.xxl,
  },
  form: {
    gap: Spacing.sm,
  },
  button: {
    marginTop: Spacing.xl,
  },
});
