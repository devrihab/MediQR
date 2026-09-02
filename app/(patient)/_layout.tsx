import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import { Colors } from '../../constants/Theme';

export default function PatientLayout() {
  const { role, patient } = useAuthStore();

  if (role !== 'patient' || !patient) {
    return <Redirect href="/(auth)/role-select" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="setup" />
      <Stack.Screen name="history" />
      <Stack.Screen name="edit-data" />
    </Stack>
  );
}
