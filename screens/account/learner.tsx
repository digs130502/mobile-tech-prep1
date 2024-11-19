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

type LoginProps = NativeStackScreenProps<RootStackParamList, "Learner">;

export default function Learner({ navigation }: LoginProps) {
  const [email, setEmail] = useState(""); // Set up email variable
  const [password, setPassword] = useState(""); // Set up password variable

  // Sign up functionality for Learner
  const handleSignUp = async () => {
    try {
      const response = await fetch("http://192.168.1.159:3000/api/signup", {
        // Fetch response from the Android Studio origin
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role: "Learner", // Give email, password, and role (L) as the request body.
        }),
      });

      const data = await response.json(); // Wait for response from endpoint

      if (response.ok) {
        Alert.alert("SUCCESS", "Account created successfully!"); // Success message
        navigation.navigate("Home");
      } else {
        Alert.alert("ERROR", data.message || "Failed to sign up"); // ERROR message if failed to sign up
      }
    } catch (error) {
      console.error("ERROR: Could not sign-up", error); //General Error messages.
      Alert.alert("ERROR", "Something went wrong. Please attempt again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Learner</Text>
      {/* Email Text Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
      />

      {/* Password TextInput */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#9C1212",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    margin: 10,
  },
  orText: {
    fontSize: 18,
    marginVertical: 10,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
});
