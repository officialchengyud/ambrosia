import { useState, useRef, useEffect } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  TopNavigation,
  Button,
  List,
  ListItem,
  Spinner,
  Text,
} from "@ui-kitten/components";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useUser } from "../contexts/UserContext";
import { addPastFood, getPastFood } from "../api/user";
import OpenAI from "openai";
import { ScrollView } from "react-native-gesture-handler";

function snakeCaseToWords(snakeCaseString) {
  return snakeCaseString
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

export default function ScanScreen({ route }) {
  const navigation = useNavigation();
  const { user, userData, refetchUserData } = useUser();
  const [permission, requestPermission] = useCameraPermissions();
  const [prevBarcode, setPrevBarcode] = useState("");
  const [isScanning, setIsScanning] = useState(true);
  const [productData, setProductData] = useState(null); // Store product data
  const [gptOutput, setGptOutput] = useState([]);
  const { foodItem } = route.params;

  useEffect(() => {
    if (foodItem) {
      setProductData({ product_name: foodItem.product_name });
      setIsScanning(false);
      setGptOutput(foodItem);
    }
  }, [foodItem]);

  // Refs to prevent the function running twice because these update syncronously
  const prevBarcodeRef = useRef("");
  const isProcessingRef = useRef(false);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Loading permissions</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Camera access is required</Text>
        <Button onPress={requestPermission} title="Grant Access" />
      </View>
    );
  }

  console.log(userData);

  const handleBarcodeScanned = async ({ data }) => {
    const checkPastFood = await getPastFood(user.email, data);
    if (checkPastFood) {
      console.log(checkPastFood);
      setProductData({ product_name: checkPastFood.product_name });
      setIsScanning(false);
      setGptOutput(checkPastFood);
      set;
      return;
    }

    if (isProcessingRef.current || data === prevBarcodeRef.current) {
      return;
    }
    isProcessingRef.current = true;
    prevBarcodeRef.current = data;
    setIsScanning(false);
    setPrevBarcode(data);

    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${data}.json`
      );
      const foodData = await response.json();

      if (foodData.status === 1) {
        const product = foodData.product;
        const servingSize = product.serving_size || "N/A";

        const nutriments = product.nutriments || {};
        const wantedNutrients = [
          "carbohydrates",
          "cholesterol",
          "energy-kcal",
          "fat",
          "fiber",
          "proteins",
          "salt",
          "saturated-fat",
          "sodium",
          "sugars",
        ];

        let nutritionInfo = {};
        wantedNutrients.forEach((nutrient) => {
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
          ? product.ingredients_text.split(",").map((item) => item.trim())
          : ["Ingredients not available"];

        const productInfo = {
          barcode: data,
          product_name: product.product_name || "Unknown",
          serving_size: servingSize,
          ingredients: ingredients,
          nutrition: nutritionInfo,
        };

        console.log("Product Data:", productInfo);
        setProductData(productInfo);

        // OpenAI function call
        openaiBarcodeAnalysis(productInfo);
      } else {
        setIsScanning(true);
        console.log("Product not found.");
      }
    } catch (error) {
      console.log("Error fetching food data:", error);
    } finally {
      isProcessingRef.current = false;
    }
  };

  const dietRestrictions = userData.dietary_restrictions;
  const allergies = userData.allergies;
  const openai = new OpenAI({
    apiKey: `${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
  });

  const openaiBarcodeAnalysis = async (productInfo) => {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
          You will receive 2 things: 
          1. A list of dietary restrictions and allergies filters that a person has.
          2. Nutritional information about a good item as well as a list of the ingredients present in that food item. 

          You are a dietitian and food health expert whose job it is to evaluate these food items purely from a dietary perspective and consider how 
          healthy they would be for regular consumption by a human. Furthermore, consider the filters provided to you which state the dietary restrictions
          and food allergies of the person consuming this food item. If the food item is safe for consumption by this individual, return a positive evaluation,
          otherwise return a negative evaluation under filters analysis if the item is not safe to consume. Make sure to provide the reason by and 
          highlight which specific ingredient or nutrient is the reason for the given evaluation. After analysing the filters, list the general pros and cons
          of the food item as you considered from a dietitian's perspective, making sure to keep each pro and con concise, relevant, impactful, significant,
          and meaningful.

          ### Response Format:
          Return a JSON object structured as:
          {
            "filters_analysis": [
              {
                "filter": "<filter_name>",
                "is_safe": true/false,
                "reason": "<explanation>",
                "problematic_ingredient": "<ingredient or nutrient>"
              }
            ],
            "general_health_evaluation": {
              "pros": ["<list of benefits>"],
              "cons": ["<list of drawbacks>"]
            }
          }

          If no filters are provided, return a general evaluation of the food item's health impact as outlined above.
          `,
          },
          {
            role: "user",
            content: `dietary restrictions: ${dietRestrictions} \n allergies: ${allergies} \n${JSON.stringify(
              productInfo
            )}`,
          },
        ],
        response_format: { type: "json_object" },
      });
      const output = completion.choices[0].message.content;
      setGptOutput(JSON.parse(output));
      addPastFood(user.email, {
        barcodeId: productInfo.barcode,
        product_name: productInfo.product_name,
        openai_response: JSON.parse(output),
      });
      refetchUserData();
      console.log(output);
      return output;
    } catch (error) {
      console.error("OpenAI API Error:", error);
    }
  };

  const safe = () => <Text>✔️</Text>;
  const notSafe = () => <Text>❌</Text>;

  const ScanComplete = () => {
    return (
      <>
        <Text style={styles.subHeading} category="h6">
          Findings:
        </Text>
        {gptOutput.filters_analysis.map((filter) => {
          return (
            <ListItem
              key={filter.filter}
              style={styles.listItem}
              title={`${snakeCaseToWords(filter.filter)}`}
              description={`${filter.reason}`}
              accessoryRight={filter.is_safe ? safe : notSafe}
            />
          );
        })}
        <Text style={styles.subHeading} category="h6">
          Pros:
        </Text>
        <Text>{gptOutput.general_health_evaluation.pros.join("\n")}</Text>
        <Text style={styles.subHeading} category="h6">
          Cons:
        </Text>
        <Text>{gptOutput.general_health_evaluation.cons.join("\n")}</Text>
      </>
    );
  };

  const resetScan = () => {
    setIsScanning(true);
    setGptOutput([]);
  };

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "white" }}>
      {!isScanning && <TopNavigation title="Home" alignment="center" />}
      {isScanning && <Text>Scan a barcode</Text>}
      {isScanning && (
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={handleBarcodeScanned}
        />
      )}
      {!isScanning && (
        <ScrollView style={styles.container}>
          {productData && (
            <Text category="h5">Product: {productData.product_name}</Text>
          )}
          {gptOutput.length === 0 && <Spinner size="giant" />}
          {gptOutput && gptOutput.filters_analysis && !isScanning && (
            <ScanComplete />
          )}
          {!foodItem && (
            <Button style={styles.scanAgainBtn} onPress={resetScan}>
              Scan Again
            </Button>
          )}
          <Button
            style={styles.logoutBtn}
            appearance="ghost"
            onPress={() => {
              navigation.navigate("Home");
            }}
          >
            Back
          </Button>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    // justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "black",
  },
  listItem: {
    marginLeft: -15,
  },
  subHeading: {
    marginTop: 15,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  resultText: {
    // color: "white",
    fontSize: 16,
    marginTop: 10,
  },
  scanAgainBtn: {
    marginTop: 20,
  },
});
