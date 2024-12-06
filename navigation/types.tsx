// types.ts
export type RootStackParamList = {
  Login: undefined;
  Account: undefined;
  Learner: undefined;
  Volunteer: undefined;
  Admin: undefined;
  Home: undefined; // For the HomeTabs component
  "Volunteer-Home": undefined; // For the VolunteerHomeTabs component
  "Admin-Home": undefined; // For the AdminHomeTabs component
  "Forgot-Password": undefined;
};

export type TabParamList = {
  Explore: undefined;
  "Question-Select": undefined;
  Settings: undefined;
};

export type VolunteerTabParamList = {
  "Volunteer-Explore": undefined;
  "Question-Create": undefined;
  "Volunteer-Settings": undefined;
};

export type AdminTabsParamList = {
  "Account-Approval": undefined;
  "Question-Approval": undefined;
  "Admin-Settings": undefined;
};

export type SettingParamList = {
  Settings: undefined;
  Edit: undefined;
  Login: undefined;
};

export type VolunteerSettingParamList = {
  "Volunteer-Settings": undefined;
  "Volunteer-Edit": undefined;
  Login: undefined;
};

export type AdminSettingParamList = {
  "Admin-Settings": undefined;
  "Admin-Edit": undefined;
  Login: undefined;
};

export type QuestionCreationParamList = {
  "Question-Create": undefined;
  Create: undefined;
};

export type QuestionSelectionParamList = {
  "Question-Select": undefined;
  "Question-Solve": { questionID: number };
};

export type ExploreParamList = {
  Explore: undefined;
  "Question-History": undefined;
  "Bookmarked-Questions": undefined;
  completed: undefined;
  question: undefined;
  attempts: undefined;
};
