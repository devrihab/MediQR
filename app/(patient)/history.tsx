import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/Theme';
import { useAuthStore } from '../../store/useAuthStore';
import { PatientService } from '../../lib/services/patient';
import { AuditLog } from '../../types';
import { AlertCircle, FileEdit, UserCheck, ShieldAlert, Check } from 'lucide-react-native';
import { Button } from '../../components/ui/Button';

export default function HistoryScreen() {
  const { patient } = useAuthStore();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    if (!patient) return;
    try {
      const data = await PatientService.getAccessHistory(patient.id);
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [patient]);

  const handleReport = async (logId: string) => {
    Alert.alert(
      "Report Access",
      "Are you sure you want to flag this access? A security report will be logged.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Report", 
          style: "destructive",
          onPress: async () => {
            try {
              await PatientService.reportAccess(logId);
              // Optimistic update
              setLogs(prev => prev.map(l => l.id === logId ? { ...l, is_reported: true } : l));
            } catch (err) {
              Alert.alert("Error", "Failed to report access.");
            }
          }
        }
      ]
    );
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'edit_data': return <FileEdit color={Colors.textSecondary} size={20} />;
      case 'normal_view': return <UserCheck color={Colors.success} size={20} />;
      case 'emergency_view': return <ShieldAlert color={Colors.error} size={20} />;
      default: return <AlertCircle color={Colors.textSecondary} size={20} />;
    }
  };

  const getTitle = (type: string) => {
    switch (type) {
      case 'edit_data': return 'Data Updated';
      case 'normal_view': return 'Access Granted';
      case 'emergency_view': return 'EMERGENCY ACCESS — LOGGED';
      case 'request_expired': return 'Request Expired';
      default: return 'Activity Logged';
    }
  };

  const renderItem = ({ item }: { item: AuditLog }) => {
    const isEmergency = item.type === 'emergency_view';
    
    return (
      <View style={[styles.row, isEmergency && styles.emergencyRow]}>
        <View style={styles.iconContainer}>
          {renderIcon(item.type)}
        </View>
        <View style={styles.content}>
          <Text style={[styles.title, isEmergency && styles.emergencyTitle]}>{getTitle(item.type)}</Text>
          <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
          {item.doctor_id && (
            <Text style={styles.details}>Provider ID: {item.doctor_id}</Text>
          )}
          {item.reason && (
            <Text style={styles.details}>Reason: {item.reason}</Text>
          )}
          
          {isEmergency && (
            <View style={styles.reportContainer}>
              {item.is_reported ? (
                <View style={styles.reportedBadge}>
                  <Check color={Colors.error} size={14} />
                  <Text style={styles.reportedText}>Reported</Text>
                </View>
              ) : (
                <TouchableOpacity onPress={() => handleReport(item.id)}>
                  <Text style={styles.reportAction}>Report this access</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={logs}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No access history found.</Text>}
        refreshing={loading}
        onRefresh={fetchLogs}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingVertical: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    padding: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  emergencyRow: {
    backgroundColor: Colors.errorSurface,
  },
  iconContainer: {
    marginRight: Spacing.md,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    ...Typography.bodyMedium,
    color: Colors.text,
    marginBottom: 4,
  },
  emergencyTitle: {
    color: Colors.error,
    fontWeight: '700',
  },
  timestamp: {
    ...Typography.metadata,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  details: {
    ...Typography.small,
    color: Colors.text,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xxl,
  },
  reportContainer: {
    marginTop: Spacing.sm,
  },
  reportAction: {
    ...Typography.smallMedium,
    color: Colors.error,
    textDecorationLine: 'underline',
  },
  reportedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reportedText: {
    ...Typography.smallMedium,
    color: Colors.error,
  }
});
