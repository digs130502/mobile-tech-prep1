import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

export default function Settings() {
  const router = useRouter();

  const handleLogout = () => {
    for (let i = 0; i < 4; i++) {
      router.back(); // Replaces current screen with login screen
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.setting}>
        <Text>Setting 1</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.setting}>
        <Text>Setting 2</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.setting}>
        <Text>Setting 3</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.setting}>
        <Text>Setting 4</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.setting}>
        <Text>Setting 5</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.setting}>
        <Text>Setting 6</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.setting} onPress={handleLogout}>
        <Text>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
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
  setting: {
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
