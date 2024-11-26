// types.ts
export type RootStackParamList = {
  Login: undefined;
  Account: undefined;
  Learner: undefined;
  Volunteer: undefined;
  Home: undefined; // For the HomeTabs component
  "Volunteer-Home": undefined; // For the VolunteerHomeTabs component
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

export type QuestionCreationParamList = {
  "Question-Create": undefined;
  Create: undefined;
};
