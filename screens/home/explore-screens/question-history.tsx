import { StyleSheet, View, Text, ScrollView, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { useAppContext } from "../../../AppContext"; //For using user's account id.
import { ExploreParamList } from "../../../navigation/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { format } from "date-fns"; //Import date-fns for date formatting in question history
import Constants from 'expo-constants';

type HistoryItem = {
  //Lists all information needed to display to the user.
  question: string;
  attempts: number;
  correctAttempts: number;
  incorrectAttempts: number;
  accuracy: string;
  difficulty: string;
  topic: string;
  lastAttempt: string;
  lastAttemptTime: string;
  hintViewed: string;
  bookmarked: string;
};

type ExploreProps = NativeStackScreenProps<
  ExploreParamList,
  "Question-History"
>;

export default function QuestionHistory({ navigation }: ExploreProps) {
  const { accountID } = useAppContext(); //To access user's account ID
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const apiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl;

  //Get all history information from database.
  const getHistory = async () => {
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/user/history/details?accountID=${accountID}`
      );

      if (!response.ok) {
        //If could not get information
        Alert.alert("Failed to get question history");
      }
      const data: HistoryItem[] = await response.json(); //Get response
      setHistory(data); //Set the History with all of the data retrieved.
    } catch (error) {
      //General error message.
      console.error("Error getting question history:", error);
    }
  };

  //Checks if the date is valid.
  const isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  useEffect(() => {
    getHistory();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Question History</Text>
      {history.length === 0 ? ( //If there is no question history to display.
      <Text style={styles.emptyText}>No question history available.</Text>) 
      : (history.map((item, index) => (
        <View key={index} style={styles.historyItem}>
          <Text style={styles.questionText}>{item.question}</Text>
          <Text style={styles.statisticsHeader}>Question Statistics</Text>
          <Text>Difficulty: {item.difficulty}</Text>
          <Text>Topic: {item.topic}</Text>
          <Text>Attempts: {item.attempts}</Text>
          <Text>Correct Attempts: {item.correctAttempts}</Text>
          <Text>Incorrect Attempts: {item.incorrectAttempts}</Text>
          <Text>Accuracy: {item.accuracy}%</Text>
          <Text>Last Attempt: {item.lastAttempt === "Pass" ? "Pass" : item.lastAttempt === "Fail" ? "Fail" : "N/A"}</Text>
          <Text>
            Last Attempt Time:{" "}
            {item.lastAttemptTime !== "N/A" && isValidDate(item.lastAttemptTime) //Displays attempt time.
              ? format(new Date(item.lastAttemptTime), "MMMM dd, yyyy, h:mm a")
              : "N/A"}
          </Text>
          <Text>Hint Viewed: {item.hintViewed}</Text>
          <Text>Bookmarked: {item.bookmarked}</Text>
        </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  historyItem: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 5,
  },
  statisticsHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  emptyText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
  },
});
