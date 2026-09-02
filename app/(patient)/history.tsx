import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Colors, Typography, Spacing } from '../../constants/Theme';
import { ShieldAlert, Eye } from 'lucide-react-native';

const MOCK_HISTORY = [
  { id: '1', date: 'Oct 12, 2026', time: '14:30', doctor: 'Dr. Gregory House', type: 'normal_view' },
  { id: '2', date: 'Sep 01, 2026', time: '09:15', doctor: 'Dr. James Wilson', type: 'emergency_view' },
];

export default function HistoryScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={MOCK_HISTORY}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={[styles.iconContainer, item.type === 'emergency_view' && styles.iconContainerEmergency]}>
                {item.type === 'emergency_view' ? (
                  <ShieldAlert color={Colors.error} size={20} />
                ) : (
                  <Eye color={Colors.primary} size={20} />
                )}
              </View>
              <View style={styles.content}>
                <Text style={styles.doctor}>{item.doctor}</Text>
                <Text style={[styles.type, item.type === 'emergency_view' && styles.typeEmergency]}>
                  {item.type === 'emergency_view' ? 'Emergency Override' : 'Authorized Access'}
                </Text>
              </View>
              <View style={styles.timeInfo}>
                <Text style={styles.date}>{item.date}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
            </View>
          )}
        />
      </View>
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
  list: {
    paddingVertical: Spacing.md,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 72, // Aligned with text
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  iconContainerEmergency: {
    backgroundColor: Colors.errorSurface,
  },
  content: {
    flex: 1,
  },
  doctor: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  type: {
    ...Typography.smallMedium,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  typeEmergency: {
    color: Colors.error,
  },
  timeInfo: {
    alignItems: 'flex-end',
  },
  date: {
    ...Typography.smallMedium,
    color: Colors.text,
  },
  time: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
});
