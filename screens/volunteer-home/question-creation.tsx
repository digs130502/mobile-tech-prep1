import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { QuestionCreationParamList } from "../../navigation/types";

type CreationProp = NativeStackScreenProps<
  QuestionCreationParamList,
  "Question-Create"
>;

export default function QuestionCreation({ navigation }: CreationProp) {
  // Technical question titles
  const questionTitles = [
    "What is the difference between REST and GraphQL?",
    "Explain the concept of closures in JavaScript.",
    "How does garbage collection work in Python?",
    "What is the purpose of Docker in modern development?",
    "Explain the lifecycle methods in React.",
    "What are the differences between TCP and UDP?",
    "How do you implement a binary search algorithm?",
    "What is the role of middleware in Express.js?",
    "Explain how the 'this' keyword works in JavaScript.",
    "What is the difference between synchronous and asynchronous programming?",
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Technical Questions</Text>
      <FlatList
        data={questionTitles}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.questionItem}>
            <Text style={styles.questionText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate("Create")}
      >
        <Text style={styles.createButtonText}>Create Question</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  questionItem: {
    padding: 15,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    marginVertical: 5,
  },
  questionText: {
    fontSize: 16,
  },
  createButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#ff4d4d", // Red button
    borderRadius: 10,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
