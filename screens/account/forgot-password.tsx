import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";

type ForgotPasswordProps = NativeStackScreenProps<
  RootStackParamList,
  "Forgot-Password"
>;

export default function ForgotPassword({ navigation }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async () => {
    if (!email || !newPassword || !confirmPassword) {
      Alert.alert("ERROR: Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("ERROR: Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        "http://192.168.1.159:3000/api/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            newPassword,
          }),
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Your password has been reset.", [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ]);
      } else {
        Alert.alert("ERROR", "Failed to reset password. Please try again.");
      }
    } catch (error) {
      Alert.alert("ERROR. Something went wrong. Please try again.");
      console.error("Reset Password Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Reset Your Password</Text>

      {/* Email TextInput */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
      />

      {/* New Password TextInput */}
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        value={newPassword}
        onChangeText={setNewPassword}
      />

      {/* Confirm Password TextInput */}
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Reset Password Button */}
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text>Reset Password</Text>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
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
});
