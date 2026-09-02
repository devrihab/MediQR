import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/Theme';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ShieldAlert } from 'lucide-react-native';

export default function EmergencyConfirmScreen() {
  const { patientId } = useLocalSearchParams();
  const router = useRouter();
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    // In real app: call DoctorService.triggerEmergencyAccess(patientId, doctorId, reason)
    router.replace(`/(doctor)/medical-data?patientId=${patientId}&emergency=true`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <ShieldAlert color={Colors.error} size={48} />
            </View>
            <Text style={styles.title}>Emergency Override</Text>
          </View>
          
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              You are accessing protected health information without explicit patient consent. 
              This action is strictly audited and must only be used in life-threatening emergencies where the patient is incapacitated.
            </Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.formTitle}>Clinical Justification</Text>
            <Input 
              placeholder="e.g. Unconscious trauma patient" 
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={4}
              style={styles.reasonInput}
              autoFocus
            />
          </View>

          <View style={styles.actions}>
            <Button 
              title="Confirm Override" 
              variant="danger" 
              onPress={handleConfirm} 
              disabled={reason.length < 10}
              style={styles.button} 
            />
            <Button 
              title="Cancel" 
              variant="ghost" 
              onPress={() => router.back()} 
              style={styles.button} 
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flexGrow: 1,
    padding: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    marginTop: Spacing.xl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.errorSurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h2,
    color: Colors.error,
  },
  warningBox: {
    backgroundColor: Colors.errorSurface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
    marginBottom: Spacing.xl,
  },
  warningText: {
    ...Typography.bodyMedium,
    color: Colors.error,
  },
  formSection: {
    flex: 1,
  },
  formTitle: {
    ...Typography.sectionHeader,
    marginBottom: Spacing.sm,
  },
  reasonInput: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: Spacing.md,
  },
  actions: {
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },
  button: {
    width: '100%',
  },
});
