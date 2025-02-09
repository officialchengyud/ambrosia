import { db } from "../firebaseConfig"; // Ensure db is initialized with getFirestore()
import { doc, setDoc, getDoc } from "firebase/firestore";

export const addUserToDB = async (userData, email) => {
    try {
        const userRef = doc(db, "users", email.toLowerCase());
    
        // Structuring user data to match Firestore format
        const userDataFormatted = {
          name: userData.name || "",
          age: userData.age || "",
          gender: userData.gender?.toLowerCase() || "",
          dietary_restrictions: userData.diet || "",
          allergies: userData.allergies,
          pantry: [
        ],
          past_foods: [
          ]
        };
    
        await setDoc(userRef, userDataFormatted);
        console.log("User data successfully saved!");
        return true;
    } catch (error) {
        console.error("Error saving user data:", error);
        return false;
    }
  try {
    console.log("Attempign to save", userData);
    const user = await setDoc(doc(db, "users", email), userData);
    console.log("User data successfully saved!", user);
    return true;
  } catch (error) {
    console.error("Error saving user data:", error);
  }
  // firestore()
  //   .collection("users")
  //   .doc(email)
  //   .set({
  //     name: userData.name,
  //     age: userData.age || "",
  //     gender: userData.gender.toLowerCase() || "",
  //     dietary_restrictions: userData.diet || "",
  //     pantry: {}, // Empty pantry at the start
  //     past_foods: {}, // Empty past foods at the start
  //     created: new Date(),
  //   })
  //   .then(() => {
  //     console.log("User added successfully");
  //   })
  //   .catch((err) => {
  //     console.log("Error adding user:", err);
  //   });
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
          pantry = Object.entries(userData.pantry).map(([barcode_id, details]) => ({
            barcode_id, // Key as barcode_id
            ...details, // Spread details containing food_name, openai_response, quantity, expiry_date
          }));
        }
  
        // Structuring output to match Firestore format
        const formattedUserData = {
          name: userData.name || "",
          age: userData.age || "",
          gender: userData.gender || "",
          dietary_restrictions: userData.dietary_restrictions || "",
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
