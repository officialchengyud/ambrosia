import React from "react";
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
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const navigateDetails = () => {
    navigation.navigate("Details");
  };

  const renderItemAccessory = () => <Button size="tiny">Delete</Button>;

  const renderItemIcon = (props) => <Icon {...props} name="person" />;

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
      <Layout style={{ padding: 20 }}>
        {userData && <Text category="h4">Hello, {userData.name}!</Text>}
        <Button
          style={styles.scanButton}
          onPress={() => navigation.navigate("Scan")}
        >
          Scan Food
        </Button>

        <Text category="h4">History</Text>
        <List style={styles.container} data={data} renderItem={renderItem} />
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

const styles = StyleSheet.create({
  container: {
    maxHeight: 480,
    marginLeft: -15,
  },
  scanButton: {
    marginTop: 20,
    marginBottom: 20,
  },
});

export default HomeScreen;
