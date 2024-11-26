import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { QuestionCreationParamList } from "../../navigation/types";
import { useAppContext } from "../../AppContext"; //For accessing accountID
import { useFocusEffect } from "@react-navigation/native"; //To fetch questions when navigating back to this page

type CreationProp = NativeStackScreenProps<
  QuestionCreationParamList,
  "Question-Create"
>;

//Defining the Question type
interface Question {
  QuestionID: number;
  Question_Text: string;
}

export default function QuestionCreation({ navigation }: CreationProp) {
  const [questions, setQuestions] = useState<Question[]>([]); //State to hold the questions
  const { accountID } = useAppContext(); //accesa account ID

  //Function to retrieve the questions created by the current question volunteer
  const fetchQuestions = useCallback(async () => {
    if (!accountID) {
      Alert.alert("ERROR: No account ID found. Try logging in again."); //Error message if account ID is not found
      return;
    }

    try {
      const response = await fetch(`http://192.168.x.x:3000/api/questions/volunteer?accountID=${accountID}`);
      const data = await response.json(); //get response

      if (response.ok) {
        setQuestions(data); //Set the questions if successful
      } 
      else {
        Alert.alert("ERROR. Failed to get questions."); //Error message if questions could not be retrieved.
      }
    } catch (error) {
      console.error("Error retrieving question volunteer's questions:", error); //General error messages
      Alert.alert("ERROR Something went wrong while fetching questions.");
    }
  } , [accountID]);

  //Calling fetchQuestions function when navigating back to this page.
  useFocusEffect(
    useCallback(() => {
      fetchQuestions();
    }, [fetchQuestions, accountID])
  );

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
