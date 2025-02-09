import { db } from "../firebaseConfig"; // Ensure db is initialized with getFirestore()
import { doc, setDoc, getDoc } from "firebase/firestore";

export const addUserToDB = async (userData, email) => {
  try {
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

export const getUserFromDb = async (email) => {
  try {
    console.log(email);
    const docRef = doc(db, "users", email); // Reference to the document
    const docSnap = await getDoc(docRef); // Fetch the document

    if (docSnap.exists()) {
      console.log("User Data:", docSnap.data());
      return docSnap.data(); // Return the user data
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
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
