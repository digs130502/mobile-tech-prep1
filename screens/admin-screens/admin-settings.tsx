import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AdminSettingParamList } from "../../navigation/types";

type SettingProps = NativeStackScreenProps<
  AdminSettingParamList,
  "Admin-Settings"
>;

export default function Settings({ navigation }: SettingProps) {
  const handleAccount = () => {
    navigation.navigate("Admin-Edit");
  };

  const handleLogout = () => {
    // Reset the navigation stack to go back to login
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.setting} onPress={handleAccount}>
        <Text>My Account</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.setting}>
        <Text>Notification Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.setting}>
        <Text>Privacy and Security</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.setting}>
        <Text>Display Preferences</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.setting}>
        <Text>Language</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.setting}>
        <Text>About App</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.setting}>
        <Text>Help and Support</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.setting}>
        <Text>Feedback</Text>
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
    paddingTop: 20,
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
    paddingVertical: 15,
    backgroundColor: "#E9E7E7",
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
