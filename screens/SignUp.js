import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
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
import ButtonMultiselect, {
  ButtonLayout,
} from "react-native-button-multiselect";
import { addUserToDB } from "../api/user";
import { ScrollView } from "react-native-gesture-handler";

const SignUpScreen = ({ navigation }) => {
  const { user, setUserData } = useUser();
  const [name, setName] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [age, setAge] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [selectedDiet, setSelectedDiet] = React.useState("");
  const [selectedAllergies, setSelectedAllergies] = React.useState([]);

  const handleButtonSelected = (selected, type) => {
    if (type === "diet") {
      setSelectedDiet(selected);
    } else {
      setSelectedAllergies(selected);
    }
  };

  const register = async () => {
    const userData = {
      name,
      gender,
      dietary_restrictions: selectedDiet,
      allergies: selectedAllergies.join(","),
      age,
      past_foods: [],
    };

    console.log(userData);

    const user = await registerUser(email, password);

    if (user) {
      const createUser = await addUserToDB(userData, email);
      if (createUser) {
        setUserData(userData);
        navigation.navigate("Home");
      }
    }
  };

  const buttons = [
    { label: "Lacto-Vegetarian", value: "lacto_vegetarian" },
    { label: "Ovo-Vegetarian", value: "ovo_vegetarian" },
    { label: "Lacto-Ovo Vegetarian", value: "lacto_ovo_vegetarian" },
    { label: "Vegan", value: "vegan" },
    { label: "Pescatarian", value: "pescatarian" },
    { label: "Keto", value: "keto" },
    { label: "Paleo", value: "paleo" },
    { label: "Halal", value: "halal" },
  ];

  const allergiesList = [
    { label: "Gluten-Free", value: "gluten_free" },
    { label: "Dairy-Free", value: "dairy_free" },
    { label: "Nut-Free", value: "nut_free" },
    { label: "Soy-Free", value: "soy_free" },
    { label: "Shellfish-Free", value: "shellfish_free" },
    { label: "Fish-Free", value: "fish_free" },
    { label: "Sesame-Free", value: "sesame_free" },
    { label: "Peanut-Free", value: "peanut_free" },
  ];

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "white" }}>
      <TopNavigation title="Signup" alignment="center" />
      <Divider />
      <ScrollView>
        <Layout style={{ padding: 20 }}>
          <Input
            label="Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={(name) => setName(name)}
            style={styles.input}
          />
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={(email) => setEmail(email.toLowerCase())}
            style={styles.input}
          />

          <Input
            value={password}
            label="Password"
            placeholder="Enter your password"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
            style={styles.input}
          />
          <Input
            label="Age"
            placeholder="Enter your age"
            value={age}
            onChangeText={(age) => setAge(age)}
            style={styles.input}
          />
          <Input
            label="Gender"
            placeholder="Enter your gender"
            value={gender}
            onChangeText={(gender) => setGender(gender)}
            style={styles.input}
          />
          <Text style={styles.dietLabel}>Dietary Restrictions</Text>
          <ButtonMultiselect
            layout={ButtonLayout.GRID}
            buttons={buttons}
            selectedButtons={selectedDiet}
            onButtonSelected={(selected) =>
              handleButtonSelected(selected, "diet")
            }
          />

          <Text style={styles.dietLabel}>Allergies</Text>
          <ButtonMultiselect
            layout={ButtonLayout.GRID}
            buttons={allergiesList}
            selectedButtons={selectedAllergies}
            onButtonSelected={(selected) =>
              handleButtonSelected(selected, "allergies")
            }
            multiselect={true}
            // Additional props can be customized as needed
          />

          <Button style={styles.signUpButton} onPress={register}>
            Sign up
          </Button>
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
  signUpButton: {
    marginTop: 20,
  },
  dietLabel: {
    marginTop: 20,
    fontWeight: "bold",
  },
});

export default SignUpScreen;
