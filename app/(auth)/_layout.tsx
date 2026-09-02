import { Stack } from 'expo-router';
import { Colors } from '../../constants/Theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="role-select" />
      <Stack.Screen name="patient-login" />
      <Stack.Screen name="doctor-login" />
    </Stack>
  );
}
