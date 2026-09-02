import React from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors, Typography, Spacing } from '../../constants/Theme';
import { useAuthStore } from '../../store/useAuthStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Divider } from '../../components/ui/Divider';

export default function EditDataScreen() {
  const { patient } = useAuthStore();

  return (
    
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={[styles.container, { flex: 1 }]} contentContainerStyle={styles.content}>
          <Text style={styles.title}>Update Identity</Text>
          <Text style={styles.subtitle}>Keep your medical information current.</Text>
          
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>BASIC MEDICAL</Text>
            <Input label="Blood Group" defaultValue={patient?.blood_group} />
            <Input label="Conditions (comma separated)" defaultValue={patient?.conditions.join(', ')} />
            <Input label="Medications (comma separated)" defaultValue={patient?.medications.join(', ')} />
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>EMERGENCY CONTACT</Text>
            <Input label="Contact Name" defaultValue={patient?.emergency_contact.name} />
            <Input label="Contact Phone" defaultValue={patient?.emergency_contact.phone} />
            <Input label="Relation" defaultValue={patient?.emergency_contact.relation} />
          </View>
          
          <Button title="Save Changes" onPress={() => {}} style={styles.saveButton} />
        </ScrollView>
      </KeyboardAvoidingView>
    
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    ...Typography.sectionHeader,
    marginBottom: Spacing.md,
  },
  formSection: {
    gap: Spacing.sm,
  },
  divider: {
    marginVertical: Spacing.xl,
  },
  saveButton: {
    marginTop: Spacing.xl,
  },
});
