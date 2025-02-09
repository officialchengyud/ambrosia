import React, { useEffect } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import {
  Button,
  Divider,
  Layout,
  TopNavigation,
  Text,
  List,
  ListItem,
  Icon,
} from "@ui-kitten/components";
import { BottomNavigation, BottomNavigationTab } from "@ui-kitten/components";
import { logoutUser } from "../firebaseConfig";
import { useUser } from "../contexts/UserContext";

import { StyleSheet } from "react-native";

const data = new Array(20).fill({
  title: "Title for Item",
  description: "Description for Item",
});

const HomeScreen = ({ navigation }) => {
  const { user, userData, setUser } = useUser();

  useEffect(() => {
    console.log(userData);
  }, []);

  const renderItemAccessory = () => <Button size="tiny">Delete</Button>;

  const renderItem = ({ item, index }) => (
    <ListItem
      title={`${item.title} ${index + 1}`}
      description={`${item.description} ${index + 1}`}
      accessoryRight={renderItemAccessory}
    />
  );

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "white" }}>
      <TopNavigation title="Home" alignment="center" />
      <Divider />
      <ScrollView>
        <Layout style={{ padding: 20 }}>
          {userData && <Text category="h4">Hello, {userData.name}!</Text>}
          <Button
            style={styles.scanButton}
            onPress={() => navigation.navigate("Scan")}
          >
            Scan Food
          </Button>

          <Text category="h4">History</Text>
          {userData &&
            Object.values(userData.past_foods).map((pastFood) => {
              return (
                <ListItem
                  key={pastFood.product_name}
                  title={`${pastFood.product_name} `}
                  style={styles.listItem}
                  onPress={() =>
                    navigation.navigate("Scan", { foodItem: pastFood })
                  }
                />
              );
            })}
          <Button
            style={styles.logoutBtn}
            appearance="ghost"
            onPress={() => {
              logoutUser();
              navigation.navigate("Login");
            }}
          >
            Logout
          </Button>
        </Layout>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 480,
    marginLeft: -15,
  },
  scanButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  listItem: {
    marginLeft: -15,
  },
  logoutBtn: {
    marginTop: 20,
  },
});

export default HomeScreen;
