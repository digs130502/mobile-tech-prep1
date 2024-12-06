import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import DropDownPicker from "react-native-dropdown-picker";
import { useAppContext } from "../../../AppContext"; //For accessing accountID

export default function Create() {
  const { accountID } = useAppContext(); //access account ID
  const [question, setQuestion] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [hint, setHint] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("Easy");
  const [topic, setTopic] = useState<string>("");
  const [pseudoQ, setPseudoQ] = useState<string>("");
  const [tscQ, setTscQ] = useState<string>("");
  const [dsQ, setDsQ] = useState<string>("");
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const [open, setOpen] = useState(false);
  const [difficultyItems, setDifficultyItems] = useState([
    { label: "Easy", value: "Easy" },
    { label: "Medium", value: "Medium" },
    { label: "Hard", value: "Hard" },
  ]);

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
    setModalVisible(false);
  };

  const deleteAnswer = (index: number): void => {
    const newAnswers = [...answers];
    newAnswers.splice(index, 1);
    setAnswers(newAnswers);
  };

  //Function to send the questions created by the current question volunteer
  const handleCreateQuestion = async () => {
    const newQuestion = {
      question,
      answers,
      hint,
      difficulty,
      topic,
      pseudo_q: pseudoQ,
      tsc_q: tscQ,
      ds_q: dsQ,
      creatorID: accountID,
    };

    //Sending the new question to the backend
    try {
      const response = await fetch(
        "http://192.168.1.159:3000/api/questions/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newQuestion),
        }
      );

      const result = await response.json();

      if (response.status === 201) {
        //If successful, then send success message
        Alert.alert("Question successfully created");
      } else {
        //ERROR message
        Alert.alert("ERROR. Could not create question.");
      }
    } catch (error) {
      console.error("Error when creating a question:", error); //General error messages
      Alert.alert("An error occurred while creating the question.");
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
    <View style={styles.outerContainer}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.centeredContainer}>
            <Text style={styles.header}>Question</Text>
            <TextInput
              style={styles.questionInput}
              placeholder="Enter question here..."
              multiline
              onChangeText={setQuestion}
              value={question}
            />
            <Text style={styles.header}>Difficulty</Text>
            <DropDownPicker
              open={open}
              value={difficulty}
              items={difficultyItems}
              setOpen={setOpen}
              setValue={setDifficulty}
              setItems={setDifficultyItems}
              containerStyle={styles.dropdown}
            />
            <Text style={styles.header}>Topic</Text>
            <TextInput
              style={styles.hintInput}
              placeholder="Enter topic here..."
              onChangeText={setTopic}
              value={topic}
            />
            <Text style={styles.header}>
              Answers - Specify First Answer as Correct
            </Text>
          </View>
        }
        data={answers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderSwipeable}
        ListFooterComponent={
          <View style={styles.centeredContainer}>
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
            <Modal
              visible={isModalVisible}
              transparent={true}
              animationType="slide"
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Select an Answer</Text>
                  {dataStructurePatterns.map((pattern) => (
                    <TouchableOpacity
                      key={pattern}
                      style={styles.modalItem}
                      onPress={() => addAnswer(pattern)}
                    >
                      <Text style={styles.modalItemText}>{pattern}</Text>
                    </TouchableOpacity>
                  ))}
                  <Pressable
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>

            <Text style={styles.header}>Hint</Text>
            <TextInput
              style={styles.hintInput}
              placeholder="Enter hint here..."
              onChangeText={setHint}
              value={hint}
            />

            <Text style={styles.header}>Pseudo Code</Text>
            <TextInput
              style={styles.hintInput}
              placeholder="Enter pseudo code here..."
              onChangeText={setPseudoQ}
              value={pseudoQ}
            />

            <Text style={styles.header}>TSC Question</Text>
            <TextInput
              style={styles.hintInput}
              placeholder="Enter TSC question here..."
              onChangeText={setTscQ}
              value={tscQ}
            />

            <Text style={styles.header}>DS Question</Text>
            <TextInput
              style={styles.hintInput}
              placeholder="Enter DS question here..."
              onChangeText={setDsQ}
              value={dsQ}
            />

            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateQuestion}
            >
              <Text style={styles.createButtonText}>Create Question</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  centeredContainer: {
    width: "90%", // Center content with margin on the sides
    alignSelf: "center",
    marginBottom: 20,
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
    width: "80%", // Make the button wider
    alignSelf: "center", // Center the button horizontally
    justifyContent: "center", // Center the text inside the button
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
    width: "80%", // Make the button wider
    alignSelf: "center", // Center the button horizontally
    alignItems: "center",
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
    width: "80%", // Make the button wider
    alignSelf: "center", // Center the button horizontally
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdown: {
    height: 50,
    marginBottom: 20,
  },
});
