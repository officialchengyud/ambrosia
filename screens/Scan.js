import { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);

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

        let nutritionInfo = {};
        wantedNutrients.forEach(nutrient => {
          let perValue = nutriments[`${nutrient}_value`];
          let perUnit = nutriments[`${nutrient}_unit`] || "";

          if (perValue === undefined) {
            perValue = "N/A";
          } else if (perValue === 0) {
            perValue = "0";
          }

          nutritionInfo[nutrient] = `${perValue} ${perUnit}`;
        });

        const ingredients = product.ingredients_text
          ? product.ingredients_text
              .split(",")
              .map(item => item.trim())
          : ["Ingredients not available"];

        const productData = {
          barcode: data,
          product_name: product.product_name || "Unknown",
          serving_size: servingSize,
          ingredients: ingredients,
          nutrition: nutritionInfo,
        };

        console.log("Product Data:", productData);
        return productData;
      } else {
        console.log("Product not found.");
        return { error: "Product not found." };
      }
    } catch (error) {
      console.log("Error fetching food data:", error);
      return { error: "Failed to fetch data." };
    }
  };

  return (
    <View style={styles.container}>
      {isScanning && <Text>Scan a barcode</Text>}

      {isScanning && (
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ["qr", "ean13", "upc_a", "code128"] }}
          onBarcodeScanned={handleBarcodeScanned}
        />
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
  camera: {
    flex: 1,
    width: "100%",
  },
});
