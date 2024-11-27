import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";

type RouteParams = {
  question: string;
};

export default function QuestionSolveScreen() {
  const route = useRoute();
  const { question } = route.params as RouteParams;

  const [revealed, setRevealed] = useState(false);
  const answers = ["ANS1", "ANS2", "ANS3", "ANS4"];
  const correctAns = answers[0];

  const shuffle = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    shuffle(answers);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.questionBox}>
        <ScrollView>
          <Text style={styles.questionText}>{question}</Text>
        </ScrollView>
      </View>
      <View>
        {answers.map((answer, i) => (
          <TouchableOpacity
            key={`${answer}-${i}`}
            style={
              revealed
                ? answer === correctAns
                  ? styles.correct
                  : styles.incorrect
                : styles.answerBox
            }
            onPress={() => setRevealed(true)}
          >
            <Text>{answer}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  questionBox: {
    width: "90%",
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#D7D7D7",
    borderRadius: 10,
    borderWidth: 1,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  answerBox: {
    width: "80%",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#EFE7E7",
    borderRadius: 5,
    alignItems: "center",
  },
  correct: {
    backgroundColor: "#20F020",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 5,
  },
  incorrect: {
    backgroundColor: "#F02020",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 5,
  },
});
