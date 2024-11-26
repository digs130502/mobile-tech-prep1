import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";

//Defining what a question holds
type Question = {
  QuestionID: number;
  Question_Text: string;
};

export default function Question_Select() {
  const [questions, setQuestions] = useState<Question[]>([]); //Set question variables

  //Function to retrieve questions from the backend
  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://192.168.x.x:3000/api/questions");
      if (!response.ok) {
        //ERROR: could not retrieve questions
        throw new Error("Failed to retrieve questions");
      }
      const data: Question[] = await response.json(); //Checks if the fetched data matches the Question type
      setQuestions(data); //Sets the questions
    } catch (error) {
      console.error("Error retrieving questions:", error); //General error messages
      Alert.alert("ERROR. Failed to load questions. Please try again.");
    }
  };

  useEffect(() => {
    fetchQuestions(); //Retrieve questions if something else happens
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {questions.map((question) => (
          <TouchableOpacity
            key={question.QuestionID}
            style={styles.question}
            onPress={() =>
              Alert.alert("Question Selected", question.Question_Text)
            }
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
