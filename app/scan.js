import { useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedBarcode, setScannedBarcode] = useState(null);

  // Request permissions if not granted
  if (!permission) {
    return <View style={styles.container}><Text>Loading permissions...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to access the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  // Function to handle barcode scanning
  const handleBarcodeScanned = async ({ data }) => {
    setScannedBarcode(data);
    Alert.alert("Barcode Captured", `Scanned Barcode: ${data}`);

    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);
      const foodData = await response.json();

      if (foodData.status === 1) {
        Alert.alert(
          "Product Found",
          `Name: ${foodData.product.product_name}\nCalories: ${foodData.product.nutriments?.["energy-kcal_100g"] || "N/A"} kcal per 100g`
        );
      } else {
        Alert.alert("Not Found", "Product not found in Open Food Facts database.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch food data.");
      console.error("Error fetching food data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr", "ean13", "upc_a", "code128"] }}
        onBarcodeScanned={handleBarcodeScanned}
      />
      {scannedBarcode && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Scanned Barcode: {scannedBarcode}</Text>
          <Button title="Scan Again" onPress={() => setScannedBarcode(null)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  message: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  resultContainer: {
    position: "absolute",
    bottom: 50,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    borderRadius: 10,
  },
  resultText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});
