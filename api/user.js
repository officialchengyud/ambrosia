import { db } from "../firebaseConfig"; // Ensure db is initialized with getFirestore()
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

export const addUserToDB = async (userData, email) => {
  try {
    const userRef = doc(db, "users", email.toLowerCase());

    // Structuring user data to match Firestore format
    const userDataFormatted = {
      name: userData.name || "",
      age: userData.age || "",
      gender: userData.gender?.toLowerCase() || "",
      dietary_restrictions: userData.dietary_restrictions || "",
      allergies: userData.allergies,
      pantry: [],
      past_foods: [],
    };

    await setDoc(userRef, userDataFormatted);
    console.log("User data successfully saved!");
    return true;
  } catch (error) {
    console.error("Error saving user data:", error);
    return false;
  }
};

export const getUserFromDB = async (email) => {
  try {
    const userRef = doc(db, "users", email.toLowerCase()); // Ensure email is lowercase
    const userSnap = await getDoc(userRef); // Fetch the document

    if (userSnap.exists()) {
      const userData = userSnap.data();

      // Ensure pantry follows list of maps structure
      let pantry = [];
      if (userData.pantry && typeof userData.pantry === "object") {
        pantry = Object.entries(userData.pantry).map(
          ([barcode_id, details]) => ({
            barcode_id, // Key as barcode_id
            ...details, // Spread details containing food_name, openai_response, quantity, expiry_date
          })
        );
      }

      // Structuring output to match Firestore format
      const formattedUserData = {
        name: userData.name || "",
        age: userData.age || "",
        gender: userData.gender || "",
        dietary_restrictions: userData.dietary_restrictions || "",
        allergies: userData.allergies || "",
        pantry: pantry || [], // Pantry is now a list of maps with barcode_id as key
        past_foods: userData.past_foods || {},
      };

      console.log("User Data:", formattedUserData);
      return formattedUserData;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving user data:", error);
    return null;
  }
};

export const addFoodToPantry = async (email, foodItem) => {
  try {
    await firestore()
      .collection("users")
      .doc(email)
      .update({
        [`pantry.${foodItem.name}`]: {
          expiry_date: foodItem.expiry_date
            ? firestore.Timestamp.fromDate(new Date(foodItem.expiry_date))
            : null,
          openai_response: foodItem.openai_response || "",
          quantity: foodItem.quantity || "",
        },
      });
    console.log("Food item added to pantry:", foodItem.name);
  } catch (error) {
    console.log("Error adding food to pantry:", error);
  }
};

// Function to add past food item
export const addPastFood = async (email, foodItem) => {
  console.log(foodItem);
  try {
    const userRef = doc(db, "users", email.toLowerCase());

    await updateDoc(userRef, {
      [`past_foods.${foodItem.barcodeId}`]: {
        ...foodItem.openai_response,
        product_name: foodItem.product_name,
      },
    });

    console.log("Food item added to past foods:", foodItem.product_name);
  } catch (error) {
    console.error("Error adding food to past foods:", error);
  }
};

// Function to get past food item
export const getPastFood = async (email, barcodeId) => {
  try {
    const userRef = doc(db, "users", email.toLowerCase());
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const pastFoods = userSnap.data().past_foods || {};
      return pastFoods[barcodeId] || null;
    } else {
      console.log("No user data found.");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving past food:", error);
    return null;
  }
};

// Function to get all past food items
export const getAllPastFoods = async (email) => {
  try {
    const userRef = doc(db, "users", email.toLowerCase());
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data().past_foods || {};
    } else {
      console.log("No user data found.");
      return {};
    }
  } catch (error) {
    console.error("Error retrieving all past foods:", error);
    return {};
  }
};
