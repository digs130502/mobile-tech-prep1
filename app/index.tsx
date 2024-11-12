import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router"; // Use useRouter from expo-router

export default function Index() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/(tabs)/home"); // pushs to the home screen in the tabs layout
  };
  const handleButton = () => {
    router.push("/account-creation");
  };

  return (
    <View style={styles.container}>
      {/* Email Text Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* Password TextInput */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text>Log In</Text>
      </TouchableOpacity>

      {/* Or */}
      <Text style={styles.or}>Or</Text>

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.button} onPress={handleButton}>
        <Text>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#9C1212",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    margin: 10,
  },
  or: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 16,
  },
});
