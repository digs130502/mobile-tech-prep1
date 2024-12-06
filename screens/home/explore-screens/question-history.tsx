import { StyleSheet, View, Text, ScrollView, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { useAppContext } from "../../../AppContext"; //For using user's account id.
import { ExploreParamList } from "../../../navigation/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { format } from "date-fns";  //Import date-fns for date formatting in question history

type HistoryItem = { //Lists all information needed to display to the user.
  question: string;
  attempts: number;
  correctAttempts: number;
  incorrectAttempts: number;
  accuracy: string;
  difficulty: string;
  topic: string;
  lastAttempt: string;
  lastAttemptTime: string;
};

type ExploreProps = NativeStackScreenProps<
  ExploreParamList,
  "Question-History"
>;

export default function QuestionHistory({ navigation }: ExploreProps) {
  const { accountID } = useAppContext(); //To access user's account ID
  const [history, setHistory] = useState<HistoryItem[]>([]);

  //Get all history information from database.
  const getHistory = async () => {
    try {
      const response = await fetch(`http://192.168.x.x:3000/api/user/history/details?accountID=${accountID}`);

      if (!response.ok) { //If could not get information
        Alert.alert("Failed to get question history");
      }
      const data: HistoryItem[] = await response.json(); //Get response
      setHistory(data); //Set the History with all of the data retrieved.
    } catch (error) { //General error message.
      console.error("Error getting question history:", error);
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Question History</Text>
      {history.map((item, index) => (
        <View key={index} style={styles.historyItem}>
          <Text style={styles.questionText}>{item.question}</Text>
          <Text style={styles.statisticsHeader}>Question Statistics</Text>
          <Text>Difficulty: {item.difficulty}</Text>
          <Text>Topic: {item.topic}</Text>
          <Text>Attempts: {item.attempts}</Text>
          <Text>Correct Attempts: {item.correctAttempts}</Text>
          <Text>Incorrect Attempts: {item.incorrectAttempts}</Text>
          <Text>Accuracy: {item.accuracy}%</Text>
          <Text>Last Attempt: {item.lastAttempt}</Text>
          <Text>Last Attempt Time: {format(new Date(item.lastAttemptTime), 'MMMM dd, yyyy, h:mm a')}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

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
});
