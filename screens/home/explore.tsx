import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useAppContext } from "../../AppContext"; // To access user's accountID
import { useFocusEffect } from "@react-navigation/native"; // For reloading the page when entering the screen
import { ExploreParamList } from "../../navigation/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type ExploreProps = NativeStackScreenProps<ExploreParamList, "Explore">;

export default function Explore({ navigation }: ExploreProps) {
  const { accountID } = useAppContext(); // Get the logged-in user's accountID
  const [questionOfTheDay, setQuestionOfTheDay] = useState("");

  const [stats, setStats] = useState({
    attempted: 0,
    completed: 0,
    accuracy: "0%",
  });

  const getStats = async () => {
    try {
      const response = await fetch(
        `http://192.168.x.x:3000/api/user/stats?accountID=${accountID}`
      );
      if (!response.ok) {
        Alert.alert("ERROR: Failed to get user stats");
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("ERROR: Could not get user stats:", error);
      Alert.alert("ERROR. Failed to get user stats. Please attempt again.");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getStats();
    }, [])
  );

  useEffect(() => {
    getStats();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Welcome Back!</Text>

      {/* Question of the Day Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Question of the Day</Text>
        <Text style={styles.questionText}>{questionOfTheDay}</Text>
        <TouchableOpacity style={styles.attemptButton}>
          <Text style={styles.attemptButtonText}>Attempt Now</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Overall Stats</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statItem}>
            Total Times Attempted: {stats.attempted}
          </Text>
          <Text style={styles.statItem}>
            Correct Attempts: {stats.completed}
          </Text>
          <Text style={styles.statItem}>Accuracy: {stats.accuracy}</Text>
        </View>
      </View>

      {/* News Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest News</Text>
        <Text style={styles.newsText}>
          New question categories added! Check out the latest interview topics
          to stay up-to-date.
        </Text>
        <Text style={styles.newsText}>
          Track your weekly progress with the new stats dashboard.
        </Text>
      </View>

      {/* Question History Button */}
      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate("Question-History")}
      >
        <Text style={styles.historyButtonText}>View Question History</Text>
      </TouchableOpacity>

      {/* Bookmarked Questions Button */}
      <TouchableOpacity
        style={styles.bookmarkedButton}
        onPress={() => navigation.navigate("Bookmarked-Questions")}
      >
        <Text style={styles.bookmarkedButtonText}>
          View Bookmarked Questions
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    width: "100%",
    backgroundColor: "#ffffff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 15,
    color: "#333",
  },
  attemptButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  attemptButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  statsContainer: {
    marginTop: 10,
  },
  statItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  newsText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
  },
  historyButton: {
    width: "100%",
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  historyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  bookmarkedButton: {
    width: "100%",
    backgroundColor: "#FF5722",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  bookmarkedButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
