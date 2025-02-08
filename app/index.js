import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome to Ambrosia!</Text>
      <Button title="Scan Food" onPress={() => router.push("/scan")} />
    </View>
  );
}
