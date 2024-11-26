import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";

export default function VolunteerExplore() {
  const [questionOfTheDay, setQuestionOfTheDay] = useState(
    "What is the difference between let, const, and var in JavaScript?"
  );
  const [stats, setStats] = useState({
    attempted: 25,
    completed: 20,
    accuracy: "80%",
  });

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
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statItem}>Attempted: {stats.attempted}</Text>
          <Text style={styles.statItem}>Completed: {stats.completed}</Text>
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
