import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  const [email, setEmail] = useState(''); //Email variable and set up
  const [password, setPassword] = useState(''); //Password variable and set up

  //Function for logging in
  const loginTest = () => 
    {
    //Testing to see if anything is inputted for email and pass
    if (!email || !password) {
      Alert.alert("ERROR", "Please enter both fields: email and password"); //ERROR if both fields are empty
      return;
    }

  //Test for comparing login info
    //Replacing with API call to backend express node which will retrieve info from database
    if (email == "test@123.com" && password == "password") {
      router.push("home");
    } 
    else {
      Alert.alert("ERROR", "Invalid email or password"); //ERROR if it doesn't match the test info
    }
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
      <TouchableOpacity
        style={styles.button}
        onPress={loginTest} //Works based on loginTest function with test email and password
      >
        <Text>Log In</Text>
      </TouchableOpacity>

      {/*Or*/}
      <Text style={styles.or}>Or</Text>

      {/* Sign Up Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("account-creation")}
      >
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
