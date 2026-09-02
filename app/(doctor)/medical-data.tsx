import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/Theme';
import { PatientService } from '../../lib/services/patient';
import { Patient } from '../../types';
import { ShieldAlert } from 'lucide-react-native';
import { Badge } from '../../components/ui/Badge';
import { Divider } from '../../components/ui/Divider';

export default function MedicalDataScreen() {
  const { patientId, emergency } = useLocalSearchParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await PatientService.getPatientData(patientId as string);
        setPatient(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [patientId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!patient) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Failed to load patient data</Text>
      </View>
    );
  }

  return (
    
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {emergency === 'true' && (
          <View style={styles.emergencyBanner}>
            <ShieldAlert color={Colors.white} size={20} />
            <Text style={styles.emergencyText}>EMERGENCY OVERRIDE LOGGED</Text>
          </View>
        )}
        
        <View style={styles.header}>
          <Text style={styles.patientName}>{patient.name}</Text>
          <Text style={styles.patientId}>ID: {patient.id}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BLOOD GROUP</Text>
          <Text style={styles.dataHero}>{patient.blood_group}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ALLERGIES</Text>
          {patient.allergies.length > 0 ? patient.allergies.map((allergy, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.listText}>{allergy.name}</Text>
              <Badge 
                label={allergy.severity} 
                variant={allergy.severity === 'severe' ? 'error' : (allergy.severity === 'moderate' ? 'warning' : 'neutral')} 
              />
            </View>
          )) : <Text style={styles.emptyText}>No known allergies</Text>}
        </View>
        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONDITIONS</Text>
          {patient.conditions.length > 0 ? patient.conditions.map((condition, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.listText}>{condition}</Text>
            </View>
          )) : <Text style={styles.emptyText}>No active conditions</Text>}
        </View>
        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MEDICATIONS</Text>
          {patient.medications.length > 0 ? patient.medications.map((med, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.listText}>{med}</Text>
            </View>
          )) : <Text style={styles.emptyText}>No current medications</Text>}
        </View>
        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EMERGENCY CONTACT</Text>
          <View style={styles.contactBlock}>
            <Text style={styles.contactName}>{patient.emergency_contact.name}</Text>
            <Text style={styles.contactRel}>{patient.emergency_contact.relation}</Text>
            <Text style={styles.contactPhone}>{patient.emergency_contact.phone}</Text>
          </View>
        </View>
      </ScrollView>
    
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
    paddingBottom: Spacing.xxxl,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  emergencyBanner: {
    backgroundColor: Colors.error,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyText: {
    ...Typography.sectionHeader,
    color: Colors.white,
    marginLeft: Spacing.sm,
  },
  header: {
    padding: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  patientName: {
    ...Typography.display,
  },
  patientId: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  section: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.sectionHeader,
    marginBottom: Spacing.md,
  },
  dataHero: {
    ...Typography.display,
    color: Colors.error,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  listText: {
    ...Typography.bodyLarge,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  divider: {
    marginHorizontal: Spacing.xl,
    marginVertical: Spacing.md,
  },
  contactBlock: {
    paddingTop: Spacing.xs,
  },
  contactName: {
    ...Typography.h3,
  },
  contactRel: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  contactPhone: {
    ...Typography.bodyLarge,
    color: Colors.primary,
    fontWeight: '500',
    marginTop: Spacing.sm,
  },
  errorText: {
    ...Typography.body,
    color: Colors.error,
  },
});
