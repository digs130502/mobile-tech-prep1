import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import MyLoginScreen from "./screens/account/login";
import MyAccountScreen from "./screens/account/account-creation";
import MyLearnerScreen from "./screens/account/learner";
import MyVolunteerScreen from "./screens/account/question-volunteer";
import MyExploreScreen from "./screens/home/explore";
import MyQuestionScreen from "./screens/home/question-select";
import MySettingsScreen from "./screens/home/settings";
import MyEditScreen from "./screens/home/account-edit/edit";
import MyVolunteerExploreScreen from "./screens/volunteer-home/volunteer-explore";
import MyQuestionCreateScreen from "./screens/volunteer-home/question-creation";
import MyVolunteerSettingsScreen from "./screens/volunteer-home/volunteer-settings";
import {
  RootStackParamList,
  TabParamList,
  SettingParamList,
  VolunteerTabParamList,
} from "./navigation/types";

const Tab = createBottomTabNavigator<TabParamList>();
const VolunteerTab = createBottomTabNavigator<VolunteerTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();
const SettingsStack = createStackNavigator<SettingParamList>();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Explore" component={MyExploreScreen} />
      <Tab.Screen name="Question-Select" component={MyQuestionScreen} />
      <Tab.Screen name="Settings" component={SettingsTab} />
    </Tab.Navigator>
  );
}

function VolunteerHomeTabs() {
  return (
    <VolunteerTab.Navigator>
      <VolunteerTab.Screen
        name="Volunteer-Explore"
        component={MyVolunteerExploreScreen}
      />
      <VolunteerTab.Screen
        name="Question-Create"
        component={MyQuestionCreateScreen}
      />
      <VolunteerTab.Screen
        name="Volunteer-Settings"
        component={MyVolunteerSettingsScreen}
      />
    </VolunteerTab.Navigator>
  );
}

function SettingsTab() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="Settings"
        component={MySettingsScreen}
        options={{ headerShown: false }}
      />
      <SettingsStack.Screen name="Edit" component={MyEditScreen} />
    </SettingsStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Login/Signup Stack */}
        <Stack.Screen name="Login" component={MyLoginScreen} />
        <Stack.Screen name="Account" component={MyAccountScreen} />
        <Stack.Screen name="Learner" component={MyLearnerScreen} />
        <Stack.Screen name="Volunteer" component={MyVolunteerScreen} />

        {/* Home Tabs */}
        <Stack.Screen
          name="Home"
          component={HomeTabs}
          options={{ headerShown: false }}
        />
        {/* Volunteer Home Tabs */}
        <Stack.Screen
          name="Volunteer-Home"
          component={VolunteerHomeTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
