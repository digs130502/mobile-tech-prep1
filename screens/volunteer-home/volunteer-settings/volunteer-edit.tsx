import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useAppContext } from "../../../AppContext"; //To access accountID

export default function Edit() {
  const [email, setEmail] = useState(""); //Email
  const [currentPassword, setCurrentPassword] = useState(""); //Current password variable for verification purposes
  const [newPassword, setNewPassword] = useState(""); //New password variable
  const { accountID } = useAppContext(); //To use current user's ID

  //Save new information/edits to account
  const handleSave = async () => {
    //Checks if accountID is available
    if (!accountID) {
      Alert.alert("ERROR: Account ID is not found.");
      return;
    }

    //Checks that all fields are entered
    if (!email || !newPassword || !currentPassword) {
      Alert.alert("ERROR: Please fill in all fields.");
      return;
    }

    try {
      //Checks if the email is correct/matches the current user
      const response = await fetch(`http://192.168.x.x:3000/api/account/email?accountID=${accountID}`, {
      });

      if (!response.ok) { //If could not get current email, give error messages
        console.error("Failed to get current email");
        Alert.alert("ERROR: Failed to get current email");
        return;
      }

      const data = await response.json(); //Get response
      //Compares emails in lowercase to disregard uppercase
      if (data.email.toLowerCase() !== email.toLowerCase()) { //Give error message if the entered email is incorrect
        Alert.alert("ERROR: Entered email does not match your current email.");
        return;
      }

      //Checka if the current password is correct.
      const passwordCheckResponse = await fetch("http://192.168.x.x:3000/api/check/current/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, currentPassword }),  //Checks using the current password entered by user
      });

      const passwordCheckData = await passwordCheckResponse.json(); //Get response
      //If current password is different than the one in the database, give error message
      if (passwordCheckData.isDifferent === true) {
        Alert.alert("ERROR: Current password is incorrect.");
        return;
      }

      //Checks if the new password entered by user is not the same as the old password
      const newPasswordCheckResponse = await fetch("http://192.168.x.x:3000/api/check/new/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }), //Give new password for comparison
      });

      const newPasswordCheckData = await newPasswordCheckResponse.json(); //Get response
      //If the current password and new password are not different (the same), then give error message
      if (newPasswordCheckData.isDifferent === false) {
        Alert.alert("ERROR: The new password cannot be the same as your current password.");
        return;
      }

      //Resets the password with the new password if everything is correct so far
      const resetPasswordResponse = await fetch("http://192.168.x.x:3000/api/reset/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }), //Give new password to use to reset.
      });

      if (!resetPasswordResponse.ok) { //If could not reset the password.
        console.error("Failed to reset the password");
        Alert.alert("ERROR: Failed to reset password");
        return;
      }

      const resetPasswordData = await resetPasswordResponse.json(); //Get response.
      //If the message is the success message, then alert the user, else give error message.
      if (resetPasswordData.message === "Password updated successfully") {
        Alert.alert("Success: Password updated successfully.");
      } else {
        Alert.alert("ERROR: Failed to update the password.");
      }
    } catch (error) { //General erroe messages.
      console.error("Error when updating password:", error);
      Alert.alert("ERROR: An error occurred. Please attempt again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Account</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your current email"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Current Password</Text>
      <TextInput
        style={styles.input}
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholder="Enter your current password"
        secureTextEntry
      />

      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Enter a new password"
        secureTextEntry
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
