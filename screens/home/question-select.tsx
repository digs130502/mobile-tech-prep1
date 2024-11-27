import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { QuestionSelectionParamList } from "../../navigation/types";

type QuestionSelectProp = NativeStackNavigationProp<
  QuestionSelectionParamList,
  "Question-Select"
>;

type Question = {
  QuestionID: number;
  Question_Text: string;
};

export default function Question_Select() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const navigation = useNavigation<QuestionSelectProp>();

  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://192.168.x.x:3000/api/questions");
      if (!response.ok) {
        throw new Error("Failed to retrieve questions");
      }
      const data: Question[] = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("Error retrieving questions:", error);
      Alert.alert("ERROR. Failed to load questions. Please try again.");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {questions.map((question) => (
          <TouchableOpacity
            key={question.QuestionID}
            style={styles.question}
            onPress={() =>
              navigation.navigate("Question-Solve", {
                question: question.Question_Text,
              })
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
