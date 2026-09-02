import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/Theme';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/Button';
import { ScanFace, LogOut } from 'lucide-react-native';

export default function DoctorDashboard() {
  const { doctor, logout } = useAuthStore();
  const router = useRouter();

  if (!doctor) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Verified Provider</Text>
            <Text style={styles.name}>{doctor.name}</Text>
          </View>
          <LogOut color={Colors.textSecondary} size={24} onPress={() => { logout(); router.replace('/'); }} />
        </View>

        <View style={styles.actionSection}>
          <View style={styles.iconWrapper}>
            <ScanFace color={Colors.primary} size={48} />
          </View>
          <Text style={styles.actionTitle}>Scan MediQR</Text>
          <Text style={styles.actionSubtitle}>
            Scan a patient's code to request access to their secure medical file.
          </Text>
          <Button
            title="Open Scanner"
            onPress={() => router.push('/(doctor)/scan')}
            style={styles.scanButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Platform.OS === 'android' ? Spacing.xl : Spacing.md,
    paddingBottom: Spacing.xl,
  },
  greeting: {
    ...Typography.smallMedium,
    color: Colors.primaryLight,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    ...Typography.h1,
    color: Colors.text,
  },
  actionSection: {
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.xxl,
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  actionTitle: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  actionSubtitle: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
    paddingHorizontal: Spacing.md,
  },
  scanButton: {
    width: '100%',
  },
});
