import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

//Define question type
type Question = {
  id: string;
  questionText: string;
  category: string;
  difficulty: string;
  answerChoices: string;
};

export default function QuestionApproval() {
  const [questions, setQuestions] = useState<Question[]>([]);

  //Get all the questions that are pending status
  const getPendingQuestions = async () => {
    try {
      const response = await fetch("http://192.168.x.x:3000/api/questions/pending");

      const data = await response.json(); //Get response

      setQuestions(data); //Set questions with data
    } catch (error) { //Error message.
      Alert.alert("ERROR: Failed to get questions.");
      console.error(error);
    }
  };

  useEffect(() => {
    getPendingQuestions();
  }, []);

  //Function for approving questions
  const approveQuestion = async (id: string) => {
    try {
      const response = await fetch("http://192.168.x.x:3000/api/approve/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionID: id, approved: 1 }), //1 for approved
      });

      if (response.ok) {
        setQuestions(questions.filter((question) => question.id !== id)); //Remove question from list.
        Alert.alert("Question Approved", `Question ID: ${id} has been approved.`); //Success message
      } else {
        Alert.alert("ERROR: Failed to approve the question."); //Error message
      }
    } catch (error) {
      Alert.alert("ERROR: Failed to approve the question."); //Error message
      console.error(error);
    }
  };

  //Function to reject Questions
  const rejectQuestion = async (id: string) => {
    try {
      const response = await fetch("http://192.168.x.x:3000/api/approve/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionID: id, approved: 0 }), //0 for rejected
      });

      if (response.ok) {
        setQuestions(questions.filter((question) => question.id !== id)); //Remove question from list.
        Alert.alert("Question Rejected", `Question ID: ${id} has been rejected.`); //Success message
      } else {
        Alert.alert("ERROR: Failed to reject the question."); //Error message
      }
    } catch (error) {
      Alert.alert("ERROR: Failed to reject the question."); //Error message
      console.error(error);
    }
  };

  const renderQuestion = ({ item }: { item: Question }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>Question: {item.questionText}</Text>
      <Text style={styles.cardText}>Topic: {item.category}</Text>
      <Text style={styles.cardText}>Difficulty: {item.difficulty}</Text>
      <Text style={styles.cardText}>Answer Choices: {item.answerChoices}</Text>
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
