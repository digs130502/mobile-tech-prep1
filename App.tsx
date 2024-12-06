import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { AppProvider } from "./AppContext";
import MyLoginScreen from "./screens/account/login";
import MyAccountScreen from "./screens/account/account-creation";
import MyLearnerScreen from "./screens/account/learner";
import MyVolunteerScreen from "./screens/account/question-volunteer";
import MyAdminScreen from "./screens/account/admin-creation";
import MyExploreScreen from "./screens/home/explore";
import MyQuestionScreen from "./screens/home/question-select";
import MySettingsScreen from "./screens/home/settings";
import MyEditScreen from "./screens/home/account-edit/edit";
import MyVolunteerExploreScreen from "./screens/volunteer-home/volunteer-explore";
import MyQuestionCreateScreen from "./screens/volunteer-home/question-creation";
import MyVolunteerSettingsScreen from "./screens/volunteer-home/volunteer-settings";
import MyVolunteerEditScreen from "./screens/volunteer-home/volunteer-settings/volunteer-edit";
import MyCreationScreen from "./screens/volunteer-home/question-create/create";
import MyQuestionSolvingScreen from "./screens/home/questions/question-solve";
import MyQuestionHistoryScreen from "./screens/home/explore-screens/question-history";
import MyForgotPasswordScreen from "./screens/account/forgot-password";
import MyBookmaredQuestionsScreen from "./screens/home/explore-screens/bookmarked-questions";
import MyAccountApprovalScreen from "./screens/admin-screens/account-approval";
import MyQuestionApprovalScreen from "./screens/admin-screens/question-approval";
import MyAdminSettingsScreen from "./screens/admin-screens/admin-settings";
import MyAdminEditScreen from "./screens/admin-screens/admin-edit/admin-edit";
import {
  RootStackParamList,
  TabParamList,
  SettingParamList,
  VolunteerTabParamList,
  VolunteerSettingParamList,
  QuestionCreationParamList,
  QuestionSelectionParamList,
  ExploreParamList,
  AdminTabsParamList,
  AdminSettingParamList,
} from "./navigation/types";

const Tab = createBottomTabNavigator<TabParamList>();
const VolunteerTab = createBottomTabNavigator<VolunteerTabParamList>();
const AdminTab = createBottomTabNavigator<AdminTabsParamList>();
const Stack = createStackNavigator<RootStackParamList>();
const SettingsStack = createStackNavigator<SettingParamList>();
const VolunteerSettingsStack =
  createStackNavigator<VolunteerSettingParamList>();
const AdminSettingsStack = createStackNavigator<AdminSettingParamList>();
const QuestionCreateStack = createStackNavigator<QuestionCreationParamList>();
const QuestionSelectionStack =
  createStackNavigator<QuestionSelectionParamList>();
const ExploreStack = createStackNavigator<ExploreParamList>();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Explore" component={ExploreTab} />
      <Tab.Screen name="Question-Select" component={QuestionSelectionTab} />
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
        options={{ title: "Explore" }}
      />
      <VolunteerTab.Screen
        name="Question-Create"
        component={QuestionCreationTab}
        options={{ title: "Create Questions" }}
      />
      <VolunteerTab.Screen
        name="Volunteer-Settings"
        component={VolunteerSettingsTab}
        options={{ title: "Settings" }}
      />
    </VolunteerTab.Navigator>
  );
}

function AdminHomeTabs() {
  return (
    <AdminTab.Navigator>
      <AdminTab.Screen
        name="Account-Approval"
        component={MyAccountApprovalScreen}
        options={{ title: "Account Approval" }}
      />
      <AdminTab.Screen
        name="Question-Approval"
        component={MyQuestionApprovalScreen}
        options={{ title: "Question Approval" }}
      />
      <AdminTab.Screen name="Admin-Settings" component={AdminSettingsTab} />
    </AdminTab.Navigator>
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

function VolunteerSettingsTab() {
  return (
    <VolunteerSettingsStack.Navigator>
      <VolunteerSettingsStack.Screen
        name="Volunteer-Settings"
        component={MyVolunteerSettingsScreen}
        options={{ headerShown: false }}
      />
      <VolunteerSettingsStack.Screen
        name="Volunteer-Edit"
        component={MyVolunteerEditScreen}
        options={{ title: "Edit Account" }}
      />
    </VolunteerSettingsStack.Navigator>
  );
}

function AdminSettingsTab() {
  return (
    <AdminSettingsStack.Navigator>
      <AdminSettingsStack.Screen
        name="Admin-Settings"
        component={MyAdminSettingsScreen}
        options={{ headerShown: false }}
      />
      <AdminSettingsStack.Screen
        name="Admin-Edit"
        component={MyAdminEditScreen}
        options={{ title: "Edit Account" }}
      />
    </AdminSettingsStack.Navigator>
  );
}

function QuestionCreationTab() {
  return (
    <QuestionCreateStack.Navigator>
      <QuestionCreateStack.Screen
        name="Question-Create"
        component={MyQuestionCreateScreen}
        options={{ headerShown: false }}
      />
      <QuestionCreateStack.Screen name="Create" component={MyCreationScreen} />
    </QuestionCreateStack.Navigator>
  );
}

function QuestionSelectionTab() {
  return (
    <QuestionSelectionStack.Navigator>
      <QuestionSelectionStack.Screen
        name="Question-Select"
        component={MyQuestionScreen}
        options={{ headerShown: false }}
      />
      <QuestionSelectionStack.Screen
        name="Question-Solve"
        component={MyQuestionSolvingScreen}
      />
    </QuestionSelectionStack.Navigator>
  );
}

function ExploreTab() {
  return (
    <ExploreStack.Navigator>
      <ExploreStack.Screen
        name="Explore"
        component={MyExploreScreen}
        options={{ headerShown: false }}
      />
      <ExploreStack.Screen
        name="Question-History"
        component={MyQuestionHistoryScreen}
      />
      <ExploreStack.Screen
        name="Bookmarked-Questions"
        component={MyBookmaredQuestionsScreen}
      />
    </ExploreStack.Navigator>
  );
}

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          {/* Login/Signup Stack */}
          <Stack.Screen name="Login" component={MyLoginScreen} />
          <Stack.Screen
            name="Forgot-Password"
            component={MyForgotPasswordScreen}
          />
          <Stack.Screen name="Account" component={MyAccountScreen} />
          <Stack.Screen name="Learner" component={MyLearnerScreen} />
          <Stack.Screen name="Volunteer" component={MyVolunteerScreen} />
          <Stack.Screen name="Admin" component={MyAdminScreen} />

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
          {/* Admin Home Tabs */}
          <Stack.Screen
            name="Admin-Home"
            component={AdminHomeTabs}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
