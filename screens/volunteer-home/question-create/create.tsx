import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useAppContext } from "../../../AppContext";

export default function Create() {
  const { accountID } = useAppContext();
  const [question, setQuestion] = useState<string>(""); // Explicitly define the type of question
  const [answers, setAnswers] = useState<string[]>([]); // Array of strings for answers
  const [hint, setHint] = useState<string>(""); // Hint is also a string
  const [isModalVisible, setModalVisible] = useState<boolean>(false); // Modal visibility is a boolean

  const dataStructurePatterns: string[] = [
    "Array",
    "Linked List",
    "Stack",
    "Queue",
    "Tree",
    "Graph",
    "Hash Table",
    "Heap",
    "Trie",
    "Set",
  ];

  const addAnswer = (answer: string): void => {
    if (answer && !answers.includes(answer)) {
      setAnswers([...answers, answer]);
    }
    setModalVisible(false); // Close modal after adding
  };

  const deleteAnswer = (index: number): void => {
    const newAnswers = [...answers];
    newAnswers.splice(index, 1);
    setAnswers(newAnswers);
  };

  const handleCreateQuestion = async (): Promise<void> => {
    if (!question || answers.length === 0 || !accountID) {
      alert("Please provide a question, answers, and ensure you're logged in.");
      return;
    }

    const questionData = {
      questionText: question,
      answers: answers,
      hint: hint,
      creatorID: accountID, // Pass accountID as creatorID
    };

    try {
      const response = await fetch("https://your-api-url.com/api/questions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Question created successfully!");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error creating question:", error);
      alert("An error occurred while creating the question.");
    }
  };

  const renderSwipeable = ({
    item,
    index,
  }: {
    item: string;
    index: number;
  }) => {
    return (
      <Swipeable
        renderRightActions={() => (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteAnswer(index)}
          >
            <Text style={styles.deleteButtonText}>X</Text>
          </TouchableOpacity>
        )}
      >
        <View style={styles.answerItem}>
          <Text style={styles.answerText}>{item}</Text>
        </View>
      </Swipeable>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Question Header */}
      <Text style={styles.header}>Question</Text>
      <TextInput
        style={styles.questionInput}
        placeholder="Enter question here..."
        multiline
        onChangeText={setQuestion}
        value={question}
      />

      {/* Answers */}
      <Text style={styles.header}>Answers</Text>
      <FlatList
        data={answers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderSwipeable} // Pass the render function directly
      />
      <View style={styles.addAnswerContainer}>
        <TouchableOpacity
          style={styles.addAnswerButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addAnswerButtonText}>+</Text>
          <Text style={styles.addAnswerText}>Add Answer</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Selecting Answer */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select an Answer</Text>
            <ScrollView style={styles.scrollableList}>
              {dataStructurePatterns.map((pattern) => (
                <TouchableOpacity
                  key={pattern}
                  style={styles.modalItem}
                  onPress={() => addAnswer(pattern)}
                >
                  <Text style={styles.modalItemText}>{pattern}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Hint */}
      <Text style={styles.header}>Hint</Text>
      <TextInput
        style={styles.hintInput}
        placeholder="Enter hint here..."
        onChangeText={setHint}
        value={hint}
      />

      {/* Create Question Button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateQuestion}
      >
        <Text style={styles.createButtonText}>Create Question</Text>
      </TouchableOpacity>
    </ScrollView>
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
    marginTop: 20,
  },
  questionInput: {
    backgroundColor: "#e0e0e0",
    height: 100,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    textAlignVertical: "top",
  },
  addAnswerContainer: {
    marginVertical: 10,
  },
  addAnswerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 10,
  },
  addAnswerButtonText: {
    color: "#fff",
    fontSize: 20,
    marginRight: 5,
  },
  addAnswerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  answerItem: {
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    marginVertical: 5,
  },
  answerText: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: "100%",
    borderRadius: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scrollableList: {
    width: "100%",
    marginBottom: 20,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  modalItemText: {
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  hintInput: {
    backgroundColor: "#e0e0e0",
    height: 50,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  createButton: {
    marginTop: 20,
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
