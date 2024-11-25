import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";

type Question = {
  QuestionID: number;
  Question_Text: string;
};

export default function Question_Select() {
  const [questions, setQuestions] = useState<Question[]>([]); // Set the correct type

  // Fetch questions from the backend
  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://192.168.1.233:3000/api/questions");
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      const data: Question[] = await response.json(); // Ensure the fetched data matches the Question type
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
      Alert.alert("Error", "Failed to load questions. Please try again.");
    }
  };

  useEffect(() => {
    fetchQuestions(); // Fetch questions when the component mounts
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      {questions.map((question) => (
          <TouchableOpacity
            key={question.QuestionID}
            style={styles.question}
            onPress={() => Alert.alert("Question Selected", question.Question_Text)}
          >
            <Text>{question.Question_Text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  question: {
    width: "80%",
    paddingVertical: 15,
    backgroundColor: "#E9E7E7",
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
