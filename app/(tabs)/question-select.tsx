import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

export default function Question_Select() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.question}>
        <Text>Question 1</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.question}>
        <Text>Question 2</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.question}>
        <Text>Question 3</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.question}>
        <Text>Question 4</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.question}>
        <Text>Question 5</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.question}>
        <Text>Question 6</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.question}>
        <Text>Question 7</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigation_bar: {
    backgroundColor: "#D9D9D9",
    width: "100%",
    height: 70,
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    bottom: 0,
  },
  button: {
    backgroundColor: "red",
    width: 30,
    height: 30,
  },
  question: {
    width: "80%",
    height: "5%",
    backgroundColor: "#E9E7E7",
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
