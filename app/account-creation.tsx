import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";

export default function Account_Creation() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Creation</Text>
      <Text style={styles.subTitle}>Are you:</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("learner")}
      >
        <Text>Learner</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>Or</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("question-volunteer")}
      >
        <Text>Question Volunteer</Text>
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
  orText: {
    fontSize: 18,
    marginVertical: 10,
  },
});
