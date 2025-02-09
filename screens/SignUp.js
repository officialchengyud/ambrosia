import React from "react";
import { SafeAreaView } from "react-native";
import {
  Button,
  Divider,
  Layout,
  TopNavigation,
  Text,
  Input,
} from "@ui-kitten/components";
import { registerUser } from "../firebaseConfig";
import { useUser } from "../contexts/UserContext";
import { addUserToDB } from "../api/user";

const SignUpScreen = ({ navigation }) => {
  const { user, setUserData } = useUser();
  const [name, setName] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [diet, setDiet] = React.useState("");
  const [age, setAge] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const register = async () => {
    const user = await registerUser(email, password);

    if (user) {
      const createUser = await addUserToDB({ name, gender, diet, age }, email);
      if (createUser) {
        setUserData({ name, gender, diet, age });
        navigation.navigate("Home");
      }
    }
  };

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "white" }}>
      <TopNavigation title="Signup" alignment="center" />
      <Divider />
      <Layout style={{ padding: 20 }}>
        <Input
          label="Name"
          placeholder="Enter your name"
          value={name}
          onChangeText={(name) => setName(name)}
        />
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={(email) => setEmail(email)}
        />

        <Input
          value={password}
          label="Password"
          placeholder="Enter your password"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <Input
          label="Age"
          placeholder="Enter your age"
          value={age}
          onChangeText={(age) => setAge(age)}
        />
        <Input
          label="Gender"
          placeholder="Enter your gender"
          value={gender}
          onChangeText={(gender) => setGender(gender)}
        />
        <Input
          label="Diet"
          placeholder="Enter your diet"
          value={diet}
          onChangeText={(diet) => setDiet(diet)}
        />
        <Button onPress={register}>Sign up</Button>
      </Layout>
    </SafeAreaView>
  );
};

export default SignUpScreen;
