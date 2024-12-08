import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { useAppContext } from "../../../AppContext"; //To access user's account ID

// Define the type for bookmarked questions
type BookmarkedQuestion = {
  question: string;
};

const BookmarkedQuestions = () => {
  const { accountID } = useAppContext(); //To access user's account ID
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<BookmarkedQuestion[]>([]);

  //Get all bookmarked questions (user's)
  const getBookmarkedQuestions = async () => {
    try {
      const response = await fetch(
        `http://192.168.x.x:3000/api/user/bookmarked-questions?accountID=${accountID}`
      );

      if (!response.ok) {
        //If could not get bookmarked questions.
        Alert.alert("Failed to get bookmarked questions");
        return;
      }

      const data = await response.json(); //Get the response
      setBookmarkedQuestions(data); //Set the bookmarked questions
    } catch (error) { //General error message
      console.error("Error getting bookmarked questions:", error);
    }
  };

  useEffect(() => {
    getBookmarkedQuestions();
  }, [accountID]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Bookmarked Questions</Text>
      {bookmarkedQuestions.length === 0 ? ( //If there are no bookmarked questions.
        <Text style={styles.emptyText}>No bookmarked questions.</Text>) 
        : (bookmarkedQuestions.map((item, index) => (
          <View key={index} style={styles.questionContainer}>
            <Text style={styles.questionText}>{item.question}</Text>
          </View>
        ))
      )}
    </ScrollView>
    );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
  emptyText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
  },
});

export default BookmarkedQuestions;
