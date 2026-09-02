import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../../constants/Theme';

export default function SetupScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Setup Data</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.xl },
  title: { ...Typography.h2, color: Colors.text },
});
