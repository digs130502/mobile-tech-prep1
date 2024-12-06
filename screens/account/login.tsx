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

type LoginProps = NativeStackScreenProps<RootStackParamList, "Login">;

export default function Login({ navigation }: LoginProps) {
  const [email, setEmail] = useState(""); //Set up email variable
  const [password, setPassword] = useState(""); //Set up password variable
  const { setAccountID } = useAppContext(); //access account ID

  //Function to check if email format is valid
  const checkEmailFormat = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //Regex to make sure there is chars followed by an @ symbol and a . followed by some chars
    return regex.test(email);
  };

  //Login functionality
  const handleLogin = async () => {
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

    try {
      const response = await fetch("http://192.168.x.x:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password, //Give email and password as the request body.
        }),
      });

      const data = await response.json(); //Wait for response from endpoint

      console.log("Response: data:", data);

      if (response.status === 200) {
        //Success set the account ID
        const { accountID, role } = data;
        setAccountID(accountID);

        if (role === "Learner") {
          navigation.navigate("Home"); //Go to the Home screen
        } else if (role === "Question Volunteer") {
          navigation.navigate("Volunteer-Home"); //Go to the Volunteer Home screen
        } else {
          Alert.alert("Login Failed", "Invalid role specified.");
        }
      } else if (response.status === 404) {
        //If email is not found
        Alert.alert("Login Failed", "Email not found.");
      } else if (response.status === 401) {
        //If password doesn't match hashed password
        Alert.alert("Login Failed", "Incorrect password");
      } else {
        //General error message
        Alert.alert("Login Failed", "An unknown error occurred");
      }
    } catch (error) {
      Alert.alert("ERROR. Something went wrong, Please attempt again."); // General error message
      console.error("Login Error:", error);
    }
  };

  const handleSignUp = () => {
    navigation.navigate("Account");
  };

  const handleForgotPassword = () => {
    navigation.navigate("Forgot-Password"); // Navigate to ForgotPassword screen
  };

  return (
    <View style={styles.container}>
      {/* App Title */}
      <Text style={styles.title}>Mobile Tech Prep</Text>

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

      {/* Forgot Password Button */}
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Or */}
      <Text style={styles.or}>Or</Text>

      {/* Sign Up Button */}
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
  forgotPassword: {
    textAlign: "center",
    marginVertical: 10,
    color: "#0000EE",
    textDecorationLine: "underline",
  },
  or: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 16,
  },
});
