import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Touchable,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";


export default function Question_Select() {
  const router = useRouter();

  const questions = [
    "Explain the difference between synchronous and asynchronous programming.",
    "How does JavaScript handle closures, and why are they useful?",
    "Describe how React's component lifecycle methods work.",
    "What is the purpose of a database index, and how does it impact performance?",
    "How would you handle error management in a large application?",
    "Explain the concept of REST and its common HTTP methods.",
    "What are Prototypical Networks, and how are they used in few-shot learning?",
    "Describe the differences between SQL and NoSQL databases.",
    "How does memory management work in Python?",
    "Explain Big O notation and why it is important in algorithm analysis.",
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={{...styles.question, ...styles.creation}}
          onPress={() =>
            router.push({
              pathname: "/(questions)/create-questions",
              params:{},
            })
          }
        >
          <Text style={styles.creationText}>+ Create Question</Text>
        </TouchableOpacity>
        {questions.map((question, index) => (
          <TouchableOpacity
            key={index}
            style={styles.question}
            onPress={() =>
              router.push({
                pathname: "/(questions)/question-solve",
                params: { question },
              })
            }
          >
            <Text>{question}</Text>
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
    padding: 15,
    backgroundColor: "#E9E7E7",
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  creation: {
    backgroundColor: "#4CAF50",
    borderColor:"#207339",
    borderWidth: 3,
    marginBottom: 30
  },
  creationText:{
    color: "#FFFFFF"
  }
});
