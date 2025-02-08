import { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { Camera } from "expo-camera";

export default function App() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null); // ✅ Fix: Explicitly allow boolean | null

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted"); // ✅ Now correctly assigns boolean
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting camera permissions...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return <Text>Camera is ready to use!</Text>;
}
