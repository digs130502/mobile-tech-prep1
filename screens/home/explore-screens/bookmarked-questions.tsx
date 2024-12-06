import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

// Define the type for bookmarked questions
type BookmarkedQuestion = {
  id: string;
  question: string;
};

const BookmarkedQuestions = () => {
  // Example data for bookmarked questions
  const bookmarkedQuestions: BookmarkedQuestion[] = [
    { id: "1", question: "What is React Native?" },
    { id: "2", question: "Explain useState in React." },
    {
      id: "3",
      question: "What is the difference between React and React Native?",
    },
  ];

  const renderQuestion = ({ item }: { item: BookmarkedQuestion }) => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionText}>{item.question}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bookmarked Questions</Text>
      <FlatList
        data={bookmarkedQuestions}
        renderItem={renderQuestion}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  questionContainer: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#FFF",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  questionText: {
    fontSize: 16,
    color: "#333",
  },
});

export default BookmarkedQuestions;
