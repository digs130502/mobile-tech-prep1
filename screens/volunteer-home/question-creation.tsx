import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { QuestionCreationParamList } from "../../navigation/types";
import { useAppContext } from "../../AppContext"; //For accessing accountID
import { useFocusEffect } from "@react-navigation/native"; //To fetch questions when navigating back to this page
import Constants from 'expo-constants';

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
  const [approvedQuestions, setApprovedQuestions] = useState<Question[]>([]); //State to hold the approved questions
  const [waitingApprovalQuestions, setWaitingApprovalQuestions] = useState<Question[]>([]); //State to hold the waiting for approval questions
  const [rejectedQuestions, setRejectedQuestions] = useState<Question[]>([]); //State to hold the rejected questions
  const { accountID } = useAppContext(); //accesa account ID

  const apiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl;

  //Function to retrieve the questions created by the current question volunteer
  const fetchQuestions = useCallback(async () => {
    if (!accountID) {
      Alert.alert("ERROR: No account ID found. Try logging in again."); //Error message if account ID is not found
      return;
    }

    try {
      //Getting approved questions
      const approvedResponse = await fetch(
        `${apiBaseUrl}/api/questions/volunteer/?accountID=${accountID}`
      );
      const approvedData = await approvedResponse.json();

      //Gettiing questions waiting for approval
      const waitingApprovalResponse = await fetch(
        `${apiBaseUrl}/api/questions/volunteer/waiting-approval?accountID=${accountID}`
      );
      const waitingApprovalData = await waitingApprovalResponse.json();

      //Getting rejected questions
      const rejectedResponse = await fetch(
        `${apiBaseUrl}/api/questions/volunteer/rejected?accountID=${accountID}`
      );
      const rejectedData = await rejectedResponse.json();

      //Checking if successful
      if (approvedResponse.ok && waitingApprovalResponse.ok && rejectedResponse.ok) {
        setApprovedQuestions(approvedData); //Set the approved questions
        setWaitingApprovalQuestions(waitingApprovalData); //Set the waiting approval questions
        setRejectedQuestions(rejectedData); //Set the rejected questions
      } else { //Error message
        Alert.alert("ERROR. Failed to get questions.");
      }
    } catch (error) { //General error messages.
      console.error("Error getting question volunteer's questions:", error);
      Alert.alert("ERROR Something went wrong while getting questions.");
    }
  }, [accountID]);

  //Calling fetchQuestions function when navigating back to this page.
  useFocusEffect(
    useCallback(() => {
      fetchQuestions();
    }, [fetchQuestions, accountID])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Approved Questions</Text>
      <FlatList
        data={approvedQuestions}
        keyExtractor={(item) => item.QuestionID.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.questionItem}>
            <Text style={styles.questionText}>{item.Question_Text}</Text>
          </TouchableOpacity>
        )}
      />
      <Text style={styles.header}>Your Questions Waiting Approval</Text>
      <FlatList
        data={waitingApprovalQuestions}
        keyExtractor={(item) => item.QuestionID.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.questionItem}>
            <Text style={styles.questionText}>{item.Question_Text}</Text>
          </TouchableOpacity>
        )}
      />
      <Text style={styles.header}>Your Rejected Questions</Text>
      <FlatList
        data={rejectedQuestions}
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
