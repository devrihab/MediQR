import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Typography, Spacing } from '../../constants/Theme';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ShieldAlert, ShieldCheck, Clock } from 'lucide-react-native';

export default function AccessRequestScreen() {
  const { patientId } = useLocalSearchParams();
  const router = useRouter();
  const [requestState, setRequestState] = useState<'initial' | 'pending' | 'approved'>('initial');

  const handleRequestAccess = () => {
    setRequestState('pending');
    // Simulate real-time approval
    setTimeout(() => {
      setRequestState('approved');
    }, 2000);
  };

  const handleEmergencyOverride = () => {
    router.push(`/(doctor)/emergency-confirm?patientId=${patientId}`);
  };

  const handleViewData = () => {
    router.replace(`/(doctor)/medical-data?patientId=${patientId}`);
  };

  return (
    
      <View style={styles.container}>
        <View style={styles.content}>
          {requestState === 'initial' && (
            <>
              <ShieldCheck color={Colors.primary} size={64} style={styles.icon} />
              <Text style={styles.title}>Request Data Access</Text>
              <Text style={styles.subtitle}>
                Patient consent is required to view their medical file. A notification will be sent to their device.
              </Text>
              <View style={styles.actions}>
                <Button title="Send Request" onPress={handleRequestAccess} />
              </View>
              <View style={styles.emergencySection}>
                <Text style={styles.emergencyLabel}>Patient unresponsive?</Text>
                <Button 
                  title="Emergency Override" 
                  variant="ghost" 
                  onPress={handleEmergencyOverride} 
                  icon={<ShieldAlert color={Colors.error} size={18} />}
                  textStyle={{ color: Colors.error }}
                />
              </View>
            </>
          )}

          {requestState === 'pending' && (
            <>
              <View style={styles.pendingIconContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Clock color={Colors.primary} size={32} style={{ position: 'absolute' }} />
              </View>
              <Text style={styles.title}>Awaiting Consent</Text>
              <Text style={styles.subtitle}>
                Please wait while the patient confirms your access request.
              </Text>
              <View style={styles.actions}>
                <Button title="Cancel Request" variant="secondary" onPress={() => router.back()} />
              </View>
              <View style={styles.emergencySection}>
                <Button 
                  title="Emergency Override Instead" 
                  variant="ghost" 
                  onPress={handleEmergencyOverride} 
                  textStyle={{ color: Colors.error }}
                />
              </View>
            </>
          )}

          {requestState === 'approved' && (
            <>
              <ShieldCheck color={Colors.success} size={64} style={styles.icon} />
              <Text style={styles.title}>Access Granted</Text>
              <Text style={styles.subtitle}>
                The patient has securely approved your request. You may now view their medical data.
              </Text>
              <View style={styles.actions}>
                <Button title="View Medical File" onPress={handleViewData} />
              </View>
            </>
          )}
        </View>
      </View>
    
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  icon: {
    marginBottom: Spacing.lg,
  },
  pendingIconContainer: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h2,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
    paddingHorizontal: Spacing.md,
  },
  actions: {
    width: '100%',
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  emergencySection: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    paddingTop: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    width: '100%',
  },
  emergencyLabel: {
    ...Typography.smallMedium,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
});
