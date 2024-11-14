import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router"; // Use useRouter from expo-router

export default function Index() {
  const router = useRouter();
  const [email, setEmail] = useState(''); //Set up email variable
  const [password, setPassword] = useState(''); //Set up password variable

  //Login functionality
  const handleLogin = async () => {
    if (!email || !password) { //If either fields are empty.
      Alert.alert("ERROR", "Please enter both email and password.");
      return;
    }
  
    try {
      const response = await fetch("http://10.0.2.2:3000/api/login", { //Fetch response from the Android Studio origin
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, password //Give email and password as the request body.
        }),
      });
  
      const data = await response.json(); //Wait for response from endpoint
  
      if (response.status === 200) { //Success
        router.push("/(tabs)/home"); //GO to the home screen.
      } else if (response.status === 404) { //If email is not found
        Alert.alert("Login Failed", "Email not found.");
      } else if (response.status === 401) { //If password doesn't match hashed password
        Alert.alert("Login Failed", "Incorrect password.");
      } else { //General error message
        Alert.alert("Login Failed", "An unknown error occurred.");
      }
    } catch (error) {
      Alert.alert("ERROR", "Something went wrong. Please attempt again."); //General error message
      console.error("Login Error:", error);
    }
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
