import React, { useEffect } from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";
import {
  Input,
  Button,
  Divider,
  Layout,
  TopNavigation,
  Modal,
  Card,
  Text,
} from "@ui-kitten/components";
import { loginUser } from "../firebaseConfig";
import { ScrollView } from "react-native-gesture-handler";
import { useUser } from "../contexts/UserContext";

const LoginScreen = ({ navigation }) => {
  const { user, setUser } = useUser();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [visible, setVisible] = React.useState(false);

  const navigateDetails = () => {
    navigation.navigate("Details");
  };

  useEffect(() => {
    if (user) {
      navigation.navigate("Home");
    }
  }, []);

  const login = async () => {
    const user = await loginUser(username, password);
    if (user) {
      setUser(user);
      navigation.navigate("Home");
    } else {
      setVisible(true);
    }
  };

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "white" }}>
      <TopNavigation title="Login" alignment="center" />
      <Divider />

      <ScrollView style={{ marginTop: 40 }}>
        <Layout
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text category="h4" style={{ marginBottom: 20 }}>
            Welcome to Ambrosia
          </Text>
          <View style={{ width: "90%", marginTop: 20, marginBottom: 20 }}>
            <Input
              style={styles.input}
              label="Email"
              placeholder="Enter your email"
              value={username}
              onChangeText={(username) => setUsername(username)}
            />
            <Input
              style={styles.input}
              value={password}
              label="Password"
              placeholder="Enter your password"
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />
          </View>
          <View style={{ width: "90%" }}>
            {visible && (
              <Text style={styles.error}>Username or password incorrect!</Text>
            )}
            <Button onPress={login}>Login</Button>
            <Button
              style={styles.input}
              appearance="ghost"
              status="primary"
              onPress={() => navigation.navigate("SignUp")}
            >
              Create an account
            </Button>
          </View>
        </Layout>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    marginTop: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
    marginBlock: 10,
  },
});

export default LoginScreen;
