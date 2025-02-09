// Add new imports at the top
import * as FileSystem from "expo-file-system";
import { TouchableOpacity, Image } from "react-native";
import { useState, useRef } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { Button, Spinner, Text, ListItem } from "@ui-kitten/components";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../contexts/UserContext";
import { addPastFood, getPastFood } from "../api/user";
import OpenAI from "openai";
import { ScrollView } from "react-native-gesture-handler";

function generateRandom8DigitNumber() {
  return Math.floor(10000000 + Math.random() * 90000000);
}

function snakeCaseToWords(snakeCaseString) {
  return snakeCaseString
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

// Add new state variables
export default function ScanPhoto({ route }) {
  const navigation = useNavigation();
  const [imagePreview, setImagePreview] = useState(null);
  const cameraRef = useRef(null);
  const { user, userData, refetchUserData } = useUser();
  const [isScanning, setIsScanning] = useState(true);
  const [productData, setProductData] = useState(null); // Store product data
  const [gptOutput, setGptOutput] = useState([]);

  // Add these functions
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });

        // Read and convert image to base64
        const base64 = await FileSystem.readAsStringAsync(photo.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const base64Image = `data:image/jpeg;base64,${base64}`;
        console.log(base64Image);
        setImagePreview(photo.uri);
        setIsScanning(false);
        openaiImageAnalysis(base64Image);
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  };

  const dietRestrictions = userData.dietary_restrictions;
  const allergies = userData.allergies;
  const openai = new OpenAI({
    apiKey: `${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
  });

  const openaiImageAnalysis = async (base64Image) => {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
            Dietary restrictions: ${dietRestrictions}
            Allergies: ${allergies}
            You are a dietitian and food health expert who has been provided with the dietary restrictions and allergies of a person as listed above. You 
            will also be provided an image of a food item that you need to evaluate. You must identify the food item and provide its name, then its ingredients 
            (if any), and the nutritional information of the item per individual recommended serving size. Considering all of this information, 
            you are tasked with evaluating these food items purely from a dietary perspective and consider how healthy they would be for regular consumption 
            by a human. Furthermore, consider the filters provided to you which state the dietary restrictions
            and food allergies of the person consuming this food item. If the food item is safe for consumption by this individual, return a positive evaluation,
            otherwise return a negative evaluation under filters analysis if the item is not safe to consume. Make sure to provide the reason by and 
            highlight which specific ingredient or nutrient is the reason for the given evaluation. After analysing the filters, list the general pros and cons
            of the food item as you considered from a dietitian's perspective, making sure to keep each pro and con concise, relevant, impactful, significant,
            and meaningful. If the image is not of a food item, set the product name to "None" and do not provide anything else in the output.

            ### Response Format:
            Return a JSON object with the following structure:
            {
            "filters_analysis": [
              {
                "filter": "<filter_name>",
                "is_safe": true/false,
                "reason": "<explanation>",
                "problematic_ingredient": "<ingredient or nutrient>"
              }
            ],
            "general_health_evaluation": 
                {
                "pros": ["<list of benefits>"],
                "cons": ["<list of drawbacks>"]
                },
            "product_name": "<name of the food item>",
            }

            If no filters are provided, return a general evaluation of the food item's health impact as outlined above.
            `,
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: base64Image },
              },
            ],
          },
        ],
        response_format: { type: "json_object" },
      });

      const output = JSON.parse(completion.choices[0].message.content);
      setGptOutput(output);
      if (output.product_name === "None") {
        // Add error "produce in the image is not a food item"
      }
      addPastFood(user.email, {
        barcodeId: generateRandom8DigitNumber(), // Store partial image ID
        product_name: output.product_name,
        openai_response: output,
      });
      console.log(output.product_name);
      setProductData({ product_name: output.product_name });
      refetchUserData();
      console.log(output);
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
        <Text>{gptOutput.general_health_evaluation.pros.join(" ")}</Text>
        <Text style={styles.subHeading} category="h6">
          Cons:
        </Text>
        <Text>{gptOutput.general_health_evaluation.cons.join(" ")}</Text>
      </>
    );
  };

  const resetScan = () => {
    setIsScanning(true);
    setGptOutput([]);
  };

  // Update your return statement
  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "white" }}>
      {isScanning && (
        <CameraView ref={cameraRef} style={styles.camera} facing="back">
          <View style={styles.imageCaptureContainer}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </CameraView>
      )}

      {!isScanning && (
        <ScrollView style={styles.container}>
          {imagePreview && (
            <Image source={{ uri: imagePreview }} style={styles.imagePreview} />
          )}
          {gptOutput.length === 0 && <Spinner size="giant" />}

          {productData && (
            <Text category="h5">Product: {productData.product_name}</Text>
          )}

          {gptOutput && gptOutput.filters_analysis && <ScanComplete />}

          {!isScanning && (
            <>
              <Button style={styles.scanAgainBtn} onPress={resetScan}>
                Scan Again
              </Button>
              <Button
                style={styles.logoutBtn}
                appearance="ghost"
                onPress={() => {
                  navigation.navigate("Home");
                }}
              >
                Back
              </Button>
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// Add new styles
const styles = StyleSheet.create({
  modeSelector: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
  },
  modeButton: {
    marginHorizontal: 10,
  },
  imageCaptureContainer: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ff0000",
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginVertical: 20,
    borderRadius: 10,
    alignSelf: "center",
  },
  camera: {
    height: "100%",
  },
});
