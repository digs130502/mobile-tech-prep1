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
import { useAppContext } from "../../AppContext"; //access account ID
import Constants from 'expo-constants';

type LoginProps = NativeStackScreenProps<RootStackParamList, "Admin">;

export default function Admin({ navigation }: LoginProps) {
  const [email, setEmail] = useState(""); // Set up email variable
  const [password, setPassword] = useState(""); // Set up password variable
  const { setAccountID } = useAppContext(); //access account ID

  const apiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl;

  //Function to check if email format is valid
  const checkEmailFormat = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //Regex to make sure there is chars followed by an @ symbol and a . followed by some chars
    return regex.test(email);
  };

  // Sign up functionality for Admin
  const handleSignUp = async () => {
    if (!email || !password) {
      //Check for empty fields
      Alert.alert("ERROR: Please enter both email and password.");
      return;
    }

    //Call function and check email format
    if (!checkEmailFormat(email)) {
      Alert.alert("ERROR: Invalid email format.");
      return;
    }

    //Checks if the email is already used/taken
    const emailCheckResponse = await fetch(
      `${apiBaseUrl}/api/check/email`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    const emailCheckData = await emailCheckResponse.json(); //Get response

    //If email already exists in database
    if (emailCheckData.exists) {
      Alert.alert("ERROR: Email is already taken"); //Give error message that learner can't use this email
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role: "Admin", // Changed role to Admin
        }),
      });

      const data = await response.json(); // Wait for response from endpoint

      if (response.ok) {
        Alert.alert("SUCCESS", "Admin account created successfully!"); // Success message
        const { accountID } = data;
        setAccountID(accountID);
        navigation.navigate("Admin-Home");
      } else {
        Alert.alert("ERROR: Failed to sign up"); // ERROR message if failed to sign up
      }
    } catch (error) {
      console.error("ERROR: Could not sign-up", error); // General Error messages.
      Alert.alert("ERROR. Something went wrong. Please attempt again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin</Text>
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
        <Text style={styles.buttonText}>Sign Up</Text>
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
  button: {
    backgroundColor: "#9C1212",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    margin: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
