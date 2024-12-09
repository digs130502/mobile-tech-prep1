import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { QuestionSelectionParamList } from "../../navigation/types";
import Constants from 'expo-constants';

type QuestionSelectProp = NativeStackNavigationProp<
  QuestionSelectionParamList,
  "Question-Select"
>;

type Question = {
  QuestionID: number;
  Question_Text: string;
  Difficulty: "Easy" | "Medium" | "Hard";
};

export default function Question_Select() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null
  );

  const apiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl;

  const navigation = useNavigation<QuestionSelectProp>();

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/questions`);
      if (!response.ok) {
        throw new Error("Failed to retrieve questions");
      }
      const data: Question[] = await response.json();
      setQuestions(data);
      setFilteredQuestions(data);
    } catch (error) {
      console.error("Error retrieving questions:", error);
      Alert.alert("ERROR. Failed to load questions. Please try again.");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    filterQuestions(text, selectedDifficulty);
  };

  const filterQuestions = (text: string, difficulty: string | null) => {
    let filtered = questions;

    if (text.trim()) {
      filtered = filtered.filter((question) =>
        question.Question_Text.toLowerCase().includes(text.toLowerCase())
      );
    }
    if (difficulty) {
      filtered = filtered.filter(
        (question) => question.Difficulty === difficulty
      );
    }

    setFilteredQuestions(filtered);
  };

  const applyFilters = () => {
    filterQuestions(searchQuery, selectedDifficulty);
    setModalVisible(false);
  };

  const clearFilters = () => {
    setSelectedDifficulty(null);
    filterQuestions(searchQuery, null);
    setModalVisible(false);
  };

  const renderQuestionsByDifficulty = (
    difficulty: "Easy" | "Medium" | "Hard"
  ) => {
    const questionsByDifficulty = filteredQuestions.filter(
      (question) => question.Difficulty === difficulty
    );

    if (questionsByDifficulty.length === 0) {
      return null;
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{difficulty} Questions</Text>
        {questionsByDifficulty.map((question) => (
          <TouchableOpacity
            key={question.QuestionID}
            style={styles.question}
            onPress={() =>
              navigation.navigate("Question-Solve", {
                questionID: question.QuestionID,
              })
            }
          >
            <Text>{question.Question_Text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar and Filter Button */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search questions..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Filters */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Questions</Text>

            {/* Difficulty Filters */}
            <Text style={styles.filterTitle}>Difficulty</Text>
            {["Easy", "Medium", "Hard"].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.filterOption,
                  selectedDifficulty === level && styles.selectedOption,
                ]}
                onPress={() => setSelectedDifficulty(level)}
              >
                <Text>{level}</Text>
              </TouchableOpacity>
            ))}

            {/* Action Buttons */}
            <View style={styles.modalButtons}>
              <Button title="Apply Filters" onPress={applyFilters} />
              <Button
                title="Clear Filters"
                onPress={clearFilters}
                color="red"
              />
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {renderQuestionsByDifficulty("Easy")}
        {renderQuestionsByDifficulty("Medium")}
        {renderQuestionsByDifficulty("Hard")}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  filterButton: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#007BFF",
    borderRadius: 10,
  },
  filterButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  scrollContainer: {
    paddingVertical: 20,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  question: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#E9E7E7",
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  filterTitle: {
    marginTop: 10,
    fontWeight: "bold",
  },
  filterOption: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#E9E7E7",
    borderRadius: 10,
  },
  selectedOption: {
    backgroundColor: "#D1D1D1",
  },
  modalButtons: {
    marginTop: 20,
  },
});
