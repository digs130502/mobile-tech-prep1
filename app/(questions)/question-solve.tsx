import { StyleSheet, View, Text } from "react-native";
import React from "react";
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";

export default function QuestionSolveScreen() {
  const { question } = useLocalSearchParams(); // Retrieve question from route parameters
  const navigation = useNavigation();
  navigation.setOptions({
    headerTitle: "", // Hides the title
    headerBackVisible: true, // Shows the back button
  });

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question}</Text>
      {/* Add additional components for solving the question */}
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
  questionText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});
