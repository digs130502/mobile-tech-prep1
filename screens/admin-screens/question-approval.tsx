import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

type Question = {
  id: string;
  questionText: string;
  category: string;
};

export default function QuestionApproval() {
  // Example list of questions pending approval
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      questionText: "",
      category: "",
    },
    {
      id: "2",
      questionText: "",
      category: "",
    },
  ]);

  // Function to handle approval
  const approveQuestion = (id: string) => {
    setQuestions(questions.filter((question) => question.id !== id));
    Alert.alert("Question Approved", `Question ID: ${id} has been approved.`);
  };

  // Function to handle rejection
  const rejectQuestion = (id: string) => {
    setQuestions(questions.filter((question) => question.id !== id));
    Alert.alert("Question Rejected", `Question ID: ${id} has been rejected.`);
  };

  const renderQuestion = ({ item }: { item: Question }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>Question: {item.questionText}</Text>
      <Text style={styles.cardText}>Category: {item.category}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.approveButton}
          onPress={() => approveQuestion(item.id)}
        >
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => rejectQuestion(item.id)}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Question Approval</Text>
      <FlatList
        data={questions}
        renderItem={renderQuestion}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No questions pending approval.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#FFF",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  approveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  rejectButton: {
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 14,
  },
  emptyText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
  },
});
