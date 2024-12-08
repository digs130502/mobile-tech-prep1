import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { format } from "date-fns"; //Import date-fns for date formatting

//Set account details
type Account = {
  AccountID: string;
  Email: string;
  AccountType: string;
  AccountCreationDate: string;
};

export default function AccountApproval() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  //Get the pending accounts
  const getPendingAccounts = async () => {
    try {
      const response = await fetch("http://192.168.x.x:3000/api/admin/pending-accounts");

      const data = await response.json(); //Get response
      setAccounts(data); //Set account data

    } catch (error) { //General error messages
      console.error("Error getting pending accounts:", error);
      Alert.alert("ERROR: Could not get pending accounts");
    }
  };

  useEffect(() => {
    getPendingAccounts();
  }, []);

  //Approve account function
  const approveAccount = async (accountID: string) => {
    try {
      const response = await fetch("http://192.168.x.x:3000/api/admin/approve-account", {
        method: 'POST',
        body: JSON.stringify({ accountID, action: 'approve' }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setAccounts(accounts.filter((account) => account.AccountID !== accountID)); //Remove the account if successful
        Alert.alert("Account Approved", `Account ID: ${accountID} has been approved.`); //Success message
      } else {
        Alert.alert("ERROR: Failed to approve the account"); //Error message
      }
    } catch (error) { //General error messages.
      console.error("Error approving account:", error);
      Alert.alert("ERROR: Could not approve the account");
    }
  };

  //Reject account function
  const rejectAccount = async (accountID: string) => {
    try {
      const response = await fetch("http://192.168.x.x:3000/api/admin/approve-account", {
        method: 'POST',
        body: JSON.stringify({ accountID, action: 'reject' }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setAccounts(accounts.filter((account) => account.AccountID !== accountID)); //Remove the account if successful
        Alert.alert("Account Rejected", `Account ID: ${accountID} has been rejected.`); //Success message
      } else {
        Alert.alert("ERROR: Failed to reject the account"); //Error message
      }
    } catch (error) { //General error messages.
      console.error("Error rejecting account:", error);
      Alert.alert("ERROR: could not reject the account");
    }
  };

  //Function to format the account creation date
  const formatCreationDate = (dateString: string) => {
    const date = new Date(dateString); //Convert the string to Date
    return format(date, "MMMM dd, yyyy."); //Format the date
  };

  const renderAccount = ({ item }: { item: Account }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>Email: {item.Email}</Text>
      <Text style={styles.cardText}>Account Type: {item.AccountType}</Text>
      <Text style={styles.cardText}>Created on: {formatCreationDate(item.AccountCreationDate)}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.approveButton}
          onPress={() => approveAccount(item.AccountID)}
        >
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => rejectAccount(item.AccountID)}
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
        keyExtractor={(item) => item.AccountID}
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
