import { useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedBarcode, setScannedBarcode] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [productInfo, setProductInfo] = useState(null);

  if (!permission) {
    return <View style={styles.container}><Text>Loading permissions</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Camera access is required</Text>
        <Button onPress={requestPermission} title="Grant Access" />
      </View>
    );
  }

  const handleBarcodeScanned = async ({ data }) => {
    if (!isScanning) return;
    setIsScanning(false);
    setScannedBarcode(data);

    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);
      const foodData = await response.json();

      if (foodData.status === 1) {
        const product = foodData.product;
        const servingSize = product.serving_size || "N/A";

        const nutriments = product.nutriments || {};
        const wantedNutrients = [
          "carbohydrates", "cholesterol", "energy-kcal", "fat", "fiber",
          "proteins", "salt", "saturated-fat", "sodium", "sugars"
        ];

        let nutritionInfo = `Serving Size: ${servingSize}\n`;

        wantedNutrients.forEach(nutrient => {
          let perValue = nutriments[`${nutrient}_value`];
          let perUnit = nutriments[`${nutrient}_unit`] || "";

          if (perValue === undefined) {
            perValue = "N/A";
          } else if (perValue === 0) {
            perValue = "0";
          }

          const nutrientName = nutrient.replace(/-/g, " ").toUpperCase();
          nutritionInfo += `${nutrientName}: ${perValue} ${perUnit}\n`;
        });

        const ingredients = product.ingredients_text
          ? product.ingredients_text
              .split(",")
              .map(item => `- ${item.trim()}`)
              .join("\n")
          : "Ingredients not available";

        setProductInfo({ name: product.product_name, ingredients, nutritionInfo });
      } else {
        setProductInfo({ name: "Not Found", ingredients: "N/A", nutritionInfo: "N/A" });
      }
    } catch (error) {
      setProductInfo({ name: "Error", ingredients: "N/A", nutritionInfo: "N/A" });
    }
  };

  return (
    <View style={styles.container}>
      {isScanning && (
        <Text style={styles.scanningMessage}>Scan a barcode</Text>
      )}

      {isScanning && (
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ["qr", "ean13", "upc_a", "code128"] }}
          onBarcodeScanned={handleBarcodeScanned}
        />
      )}

      {scannedBarcode && productInfo && (
        <ScrollView style={styles.resultContainer}>
          <Text style={styles.resultText}>Product Name: {productInfo.name || "Unknown"}</Text>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <Text style={styles.resultText}>{productInfo.ingredients}</Text>
          <Text style={styles.sectionTitle}>Nutritional Information</Text>
          <Text style={styles.resultText}>{productInfo.nutritionInfo}</Text>
          <Button title="Scan Again" onPress={() => { setScannedBarcode(null); setProductInfo(null); setIsScanning(true); }} />
        </ScrollView>
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
  scanningMessage: {
    position: "absolute",
    top: 50,
    color: "white",
    fontSize: 16,
    textAlign: "center",
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 10,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  resultContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
    width: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  resultText: {
    color: "black",
    fontSize: 14,
    textAlign: "left",
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginTop: 10,
  },
});
