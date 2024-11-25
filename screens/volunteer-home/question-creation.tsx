import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import React, { useState, useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { QuestionCreationParamList } from "../../navigation/types";
import { useAppContext } from "../../AppContext"; // For accessing accountID

type CreationProp = NativeStackScreenProps<
  QuestionCreationParamList,
  "Question-Create"
>;

// Define the Question type
interface Question {
  QuestionID: number;
  Question_Text: string;
}

export default function QuestionCreation({ navigation }: CreationProp) {
  const [questions, setQuestions] = useState<Question[]>([]); // State to hold the questions
  const { accountID } = useAppContext();

  // Fetch the questions created by the current question volunteer
  const fetchQuestions = async () => {
    if (!accountID) {
      Alert.alert("Error", "No accountID found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`http://192.168.1.233:3000/api/questions/volunteer?accountID=${accountID}`);
      const data = await response.json();

      if (response.ok) {
        setQuestions(data); // Set the questions in state
      } else {
        Alert.alert("Error", data.message || "Failed to fetch questions");
      }
    } catch (error) {
      console.error("Error fetching volunteer's questions:", error);
      Alert.alert("Error", "Something went wrong while fetching questions.");
    }
  };

  // Fetch questions when the component mounts or when accountID changes
  useEffect(() => {
    fetchQuestions();
  }, [accountID]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Questions</Text>
      <FlatList
        data={questions}
        keyExtractor={(item) => item.QuestionID.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.questionItem}>
            <Text style={styles.questionText}>{item.Question_Text}</Text>
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
