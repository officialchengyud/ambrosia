import React from "react";
import { SafeAreaView } from "react-native";
import {
  Button,
  Divider,
  Layout,
  TopNavigation,
  Text,
} from "@ui-kitten/components";
import { logoutUser } from "../firebaseConfig";
import { useUser } from "../contexts/UserContext";

const HomeScreen = ({ navigation }) => {
  const { user, setUser } = useUser();

  const navigateDetails = () => {
    navigation.navigate("Details");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation title="MyApp" alignment="center" />
      <Divider />
      <Layout
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        {user && <Text>Welcome, {user.email}</Text>}
        <Button onPress={navigateDetails}>OPEN DETAILS</Button>
        <Button onPress={() => navigation.navigate("Scan")}>Scan Food</Button>
        <Button
          onPress={() => {
            logoutUser();
            navigation.navigate("Login");
          }}
        >
          Logout
        </Button>
      </Layout>
    </SafeAreaView>
  );
};

export default HomeScreen;
