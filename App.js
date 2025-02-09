import React from "react";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/Home";
import ScanScreen from "./screens/Scan";
import ScanPhoto from "./screens/ScanPhoto";
import LoginScreen from "./screens/Login";
import { UserProvider } from "./contexts/UserContext"; // Import the UserProvider
import SignUpScreen from "./screens/SignUp";
import { EvaIconsPack } from "@ui-kitten/eva-icons";

const { Navigator, Screen } = createStackNavigator();

export default () => (
  <UserProvider>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={eva.light}>
      <NavigationContainer>
        <Navigator screenOptions={{ headerShown: false }}>
          <Screen name="Login" component={LoginScreen} />
          <Screen name="Home" component={HomeScreen} />
          <Screen name="Scan" component={ScanScreen} />
          <Screen name="ScanPhoto" component={ScanPhoto} />
          <Screen name="SignUp" component={SignUpScreen} />
        </Navigator>
      </NavigationContainer>
    </ApplicationProvider>
  </UserProvider>
);
