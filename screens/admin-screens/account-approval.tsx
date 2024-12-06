import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

type Account = {
  id: string;
  name: string;
  email: string;
};

export default function AccountApproval() {
  // Example list of accounts pending approval
  const [accounts, setAccounts] = useState<Account[]>([
    { id: "1", name: "John Doe", email: "john.doe@example.com" },
    { id: "2", name: "Jane Smith", email: "jane.smith@example.com" },
  ]);

  // Function to handle approval
  const approveAccount = (id: string) => {
    setAccounts(accounts.filter((account) => account.id !== id));
    Alert.alert("Account Approved", `Account ID: ${id} has been approved.`);
  };

  // Function to handle rejection
  const rejectAccount = (id: string) => {
    setAccounts(accounts.filter((account) => account.id !== id));
    Alert.alert("Account Rejected", `Account ID: ${id} has been rejected.`);
  };

  const renderAccount = ({ item }: { item: Account }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>Name: {item.name}</Text>
      <Text style={styles.cardText}>Email: {item.email}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.approveButton}
          onPress={() => approveAccount(item.id)}
        >
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => rejectAccount(item.id)}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Approval</Text>
      <FlatList
        data={accounts}
        renderItem={renderAccount}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No accounts pending approval.</Text>
        }
      />
    </View>
  );
}

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
  card: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#FFF",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  approveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  rejectButton: {
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 14,
  },
  emptyText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
  },
});
