import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import { Colors } from '../../constants/Theme';

export default function DoctorLayout() {
  const { role, doctor } = useAuthStore();

  if (role !== 'doctor' || !doctor) {
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
      <Stack.Screen name="scan" />
      <Stack.Screen name="access-request" />
      <Stack.Screen name="emergency-confirm" />
      <Stack.Screen name="medical-data" />
    </Stack>
  );
}
