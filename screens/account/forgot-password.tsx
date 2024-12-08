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
  const [email, setEmail] = useState(""); //variable for email
  const [newPassword, setNewPassword] = useState(""); //variable for new password
  const [confirmPassword, setConfirmPassword] = useState(""); //variable for the confirm password field

  //Function to check if email format is valid
  const checkEmailFormat = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //Regex to make sure there is chars followed by an @ symbol and a . followed by some chars
    return regex.test(email);
  };

  const handleResetPassword = async () => {
    //If fields are missing
    if (!email || !newPassword || !confirmPassword) {
      Alert.alert("ERROR: Please fill in all fields.");
      return;
    }

    //Call function and check email format
    if (!checkEmailFormat(email)) {
      Alert.alert("ERROR: Invalid email format.");
      return;
    }

    //If user entered different passwords
    if (newPassword !== confirmPassword) {
      Alert.alert("ERROR: Passwords do not match.");
      return;
    }

    try {
      //Checks if the email exists in database
      const emailCheckResponse = await fetch(
        "http://192.168.x.x:3000/api/check/email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const emailCheckData = await emailCheckResponse.json(); //Get response
      //If email does not exist
      if (!emailCheckData.exists) {
        Alert.alert("ERROR: Email not found.");
        return;
      }

      //First, check if the account is approved
      const approvalCheckResponse = await fetch(
        "http://192.168.x.x:3000/api/check/approval",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
  
      const approvalCheckData = await approvalCheckResponse.json(); //Get response
  
      //If the account is not approved or rejected do not continue
      if (approvalCheckResponse.status !== 200) {
        Alert.alert(approvalCheckData.message); //Show the error message
        return;
      }  

      //Check if the new password is the same as the current password stored in the database
      const passwordCheckResponse = await fetch(
        "http://192.168.x.x:3000/api/check/new/password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, newPassword }), //send email and newpassword to compare to current password
        }
      );

      const passwordCheckData = await passwordCheckResponse.json(); //Get response

      //If the new password entered is not different
      if (!passwordCheckData.isDifferent) {
        Alert.alert(
          "ERROR: New password cannot be the same as the old password."
        );
        return;
      }

      //Reset passwrod
      const response = await fetch(
        "http://192.168.x.x:3000/api/reset/password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, newPassword }), //send email and newpassword to replace old password
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Your password has been reset.", [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"), //navigate to login page if successful
          },
        ]);
      } else {
        //If could not reset password
        Alert.alert("ERROR: Failed to reset password. Please try again.");
      }
    } catch (error) {
      //General error messages.
      Alert.alert("ERROR. Something went wrong. Please try again.");
      console.error("Could not reset password:", error);
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
