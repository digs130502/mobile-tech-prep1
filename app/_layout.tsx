import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* Initial Login and Account Creation Screens */}
      <Stack.Screen name="index" options={{ title: "Login" , headerShown: false, }} />
      <Stack.Screen
        name="account-creation"
        options={{ title: "Account Creation" }}
      />
      <Stack.Screen name="learner" options={{ title: "Learner" }} />
      <Stack.Screen
        name="question-volunteer"
        options={{ title: "Question Volunteer" }}
      />

      {/* Main App Screens with Tabs */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
