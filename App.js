import React from "react";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/Home";
import ScanScreen from "./screens/Scan";
import ScanScreen1 from "./screens/image-capture";
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
          <Screen name="Scan1" component={ScanScreen1} />
          <Screen name="SignUp" component={SignUpScreen} />
        </Navigator>
      </NavigationContainer>
    </ApplicationProvider>
  </UserProvider>
);
