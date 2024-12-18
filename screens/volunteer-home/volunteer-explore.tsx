import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useAppContext } from "../../AppContext"; //To access question volunteer's accountID
import { useFocusEffect } from "@react-navigation/native"; //For reloading the page when entering the screen
import Constants from 'expo-constants';

export default function VolunteerExplore() {
  const { accountID } = useAppContext(); //Get the logged-in question volunteer's accountID
  const [questionOfTheDay, setQuestionOfTheDay] = useState(
    "A different question will be presented every day."
  );

  const apiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl;

  //Displays the question volunteer's created question statistics, set to be 0 when first logging in
  const [stats, setStats] = useState({
    questionsCreated: 0,
    attempted: 0,
    completed: 0,
    accuracy: "0%",
    hintsViewed: 0,
    bookmarks: 0,
  });

  //Gets volunteer's question stats
  const getStats = async () => {
    //Checks if accountID is valid/found.
    if (!accountID) {
      console.error("Account ID not available!");
      return;
    }
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/volunteer/stats?accountID=${accountID}`
      );
      if (!response.ok) {
        Alert.alert("ERROR: Failed to get question volunteer stats"); //Error message if couldn't get QV stats
      }

      const data = await response.json();
      setStats(data); //Update stats with the retrieved data
    } catch (error) {
      console.error("ERROR: Could not get question volunteer stats:", error); //General error messages
      Alert.alert(
        "ERROR. Failed to get question volunteer stats. Please attempt again."
      );
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getStats();
    }, [])
  );

  useEffect(() => {
    getStats();
  }, [accountID]);

  //For handling the QOTD.
  const handleAttemptNow = () => {
    Alert.alert("Access Denied", "Please use a learner account to access the QOTD.");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Welcome Back!</Text>

      {/* Question of the Day Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Question of the Day</Text>
        <Text style={styles.questionText}>{questionOfTheDay}</Text>
        <TouchableOpacity style={styles.attemptButton} onPress={handleAttemptNow}>
          <Text style={styles.attemptButtonText}>Attempt Now</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Created Question Stats</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statItem}>Questions Created: {stats.questionsCreated}</Text>
          <Text style={styles.statItem}>
            Times Attempted: {stats.attempted}
          </Text>
          <Text style={styles.statItem}>
            Correct Attempts: {stats.completed}
          </Text>
          <Text style={styles.statItem}>Accuracy: {stats.accuracy}</Text>
          <Text style={styles.statItem}>Hints Viewed: {stats.hintsViewed}</Text>
          <Text style={styles.statItem}>Bookmarks: {stats.bookmarks}</Text>
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
});
