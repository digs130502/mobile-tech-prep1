import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";

export default function Settings() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.navigation_bar}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("home")}
        ></TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("question-select")}
        ></TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("settings")}
        ></TouchableOpacity>
      </SafeAreaView>
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
});
