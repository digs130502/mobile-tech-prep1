import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Login" }} />
      <Stack.Screen name="home" options={{ title: "Home" }} />
      <Stack.Screen
        name="account-creation"
        options={{ title: "Account Creation" }}
      />
      <Stack.Screen name="learner" options={{ title: "Learner" }} />
      <Stack.Screen
        name="question-volunteer"
        options={{ title: "Question Volunteer" }}
      />
    </Stack>
  );
}
