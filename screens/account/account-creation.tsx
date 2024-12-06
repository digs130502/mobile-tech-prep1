import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";

type LoginProps = NativeStackScreenProps<RootStackParamList, "Account">;

export default function Account_Creation({ navigation }: LoginProps) {
  const handleLearner = () => {
    navigation.navigate("Learner");
  };

  const handleVolunteer = () => {
    navigation.navigate("Volunteer");
  };

  const handleAdmin = () => {
    navigation.navigate("Admin");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Creation</Text>
      <Text style={styles.subTitle}>Are you:</Text>

      {/* Learner Button */}
      <TouchableOpacity style={styles.button} onPress={handleLearner}>
        <Text style={styles.buttonText}>Learner</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Or</Text>

      {/* Volunteer Button */}
      <TouchableOpacity style={styles.button} onPress={handleVolunteer}>
        <Text style={styles.buttonText}>Question Volunteer</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Or</Text>

      {/* Admin Button */}
      <TouchableOpacity style={styles.button} onPress={handleAdmin}>
        <Text style={styles.buttonText}>Admin</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  buttonText: {
    color: "#000", // Changed back to black
    fontSize: 16,
    fontWeight: "bold",
  },
  orText: {
    fontSize: 18,
    marginVertical: 10,
  },
});
