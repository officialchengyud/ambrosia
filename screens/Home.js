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
  const { user, userData, setUser } = useUser();

  const navigateDetails = () => {
    navigation.navigate("Details");
  };

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "white" }}>
      <TopNavigation title="Home" alignment="center" />
      <Divider />
      <Layout style={{ padding: 20 }}>
        {userData && <Text category="h5">Welcome, {userData.name}</Text>}
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

        <Text category="h3">History</Text>
      </Layout>
    </SafeAreaView>
  );
};

export default HomeScreen;
