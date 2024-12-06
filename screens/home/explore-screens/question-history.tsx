import { StyleSheet, View, Text, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { useAppContext } from "../../../AppContext";
import { ExploreParamList } from "../../../navigation/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type HistoryItem = {
  question: string;
  completed: boolean;
  attempts: number;
};

type ExploreProps = NativeStackScreenProps<
  ExploreParamList,
  "Question-History"
>;

export default function QuestionHistory({ navigation }: ExploreProps) {
  const { accountID } = useAppContext();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(
        `http://192.168.x.x:3000/api/user/history?accountID=${accountID}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch question history");
      }
      const data: HistoryItem[] = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Error fetching question history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Question History</Text>
      {history.map((item, index) => (
        <View key={index} style={styles.historyItem}>
          <Text style={styles.questionText}>{item.question}</Text>
          <Text>Status: {item.completed ? "Completed" : "Incomplete"}</Text>
          <Text>Attempts: {item.attempts}</Text>
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
});
