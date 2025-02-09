import firestore from "@react-native-firebase/firestore";
import uuid from "react-native-uuid";

export const addUserToDB = async (userData, email) => {
  const userUUID = uuid.v4();

  firestore()
    .collection("users")
    .doc(email)
    .set({
      name: userData.name,
      age: userData.age || "",
      gender: userData.gender.toLowerCase() || "",
      dietary_restrictions: userData.diet || "",
      pantry: {}, // Empty pantry at the start
      past_foods: {}, // Empty past foods at the start
      created: new Date(),
    })
    .then(() => {
      console.log("User added successfully");

      firestore()
        .collection("matches")
        .doc(userUUID)
        .set({
          pending: [],
          awaiting: [],
          connections: [],
          passed: []
        });

      firestore()
        .collection("matches")
        .doc("mastersheet")
        .update({
          users: firestore.FieldValue.arrayUnion(userUUID),
        });
    })
    .catch((err) => {
      console.log("Error adding user:", err);
    });
};


export const addFoodToPantry = async (email, foodItem) => {
  try {
    await firestore()
      .collection("users")
      .doc(email)
      .update({
        [`pantry.${foodItem.name}`]: {
          expiry_date: foodItem.expiry_date ? firestore.Timestamp.fromDate(new Date(foodItem.expiry_date)) : null,
          openai_response: foodItem.openai_response || "",
          quantity: foodItem.quantity || "",
        }
      });
    console.log("Food item added to pantry:", foodItem.name);
  } catch (error) {
    console.log("Error adding food to pantry:", error);
  }
};

// Function to add past food item
export const addPastFood = async (email, foodItem) => {
  try {
    await firestore()
      .collection("users")
      .doc(email)
      .update({
        [`past_foods.${foodItem.name}`]: foodItem.openai_response,
      });
    console.log("Food item added to past foods:", foodItem.name);
  } catch (error) {
    console.log("Error adding food to past foods:", error);
  }
};
