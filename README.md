<div align="center">
  <h2>Abrosia</h2>
    <p align="center"><i>
        Convert any website into readable, more fun text
        </i><br />
        <br />
        <a href="https://devpost.com/software/ambrosia-ey1j3h">Devpost</a>
        ·
        <a href="https://github.com/officialchengyud/ambrosia/issues">Report Bug</a>
        ·
        <a href="https://github.com/officialchengyud/ambrosia/issues">Request Feature</a>
    </p>
</div>

<div align="center">
<img src="https://github.com/user-attachments/assets/a764a92c-0aeb-4141-9833-3086476ffa2d" width="200">
</div>

## Inspiration
The idea for this project came from the daily struggle of individuals with dietary restrictions, allergies, or health-conscious goals who find it difficult to assess whether a food product is suitable for them. Existing solutions often require manual ingredient checks, which can be tedious and error-prone. We wanted to create a seamless, automated solution that provides instant nutritional insights and dietary compatibility assessments.

## What it does
Throughout the development of this project, we explored: Camera and Barcode Scanning: Utilizing expo-camera to detect barcodes and capture images when a barcode is unavailable. API Integration: Fetching real-time product data from the Open Food Facts API to retrieve ingredient and nutrition information. State Management & Optimization: Ensuring smooth user experience by handling asynchronous operations, avoiding duplicate scans, and implementing timeout-based fallbacks. User Experience Considerations: Designing the interface to minimize user input while maximizing relevant output.

## How we built it
The project was developed using: React Native & Expo: For cross-platform mobile application development. Expo Camera: For barcode scanning and image capture. Firebase Firestore: For storing user data, dietary preferences, and scan history. Open Food Facts API: To retrieve food product information. AI-based Dietary Analysis (Future Scope): Evaluating ingredient lists against user preferences for allergy alerts and health recommendations.

## Challenges we ran into
Barcode Detection Issues: Some barcodes were difficult to scan under poor lighting or awkward angles. We implemented a 10-second fallback where the app captures an image if no barcode is detected. Permission Handling: Ensuring the app requests and correctly handles camera permissions for both iOS and Android. Data Formatting & Consistency: Standardizing the nutritional data retrieved from Open Food Facts, as some entries had missing or inconsistent information. Performance Optimization: Avoiding unnecessary re-renders and preventing duplicate API calls when scanning.

## Accomplishments that we're proud of
Real-Time Product Insights: Successfully integrated the Open Food Facts API to provide instant nutritional and ingredient information. User-Centric Dietary Filtering: Designed a system that allows users to define dietary restrictions and allergies, enabling personalized food evaluations. Error Handling & Performance Optimization: Improved state management, reduced API call redundancy, and ensured smooth app performance even with multiple scans. Scalability for Future Features: Laid the groundwork for future enhancements, including pantry tracking and recipe recommendations.

## What we learned
Working with Expo Camera: Overcame various challenges in handling barcode detection, image capturing, and permission management on both Android and iOS. Handling API Data Variability: Learned to structure responses from Open Food Facts effectively, ensuring missing or inconsistent nutritional data doesn’t break the app. State Management in React Native: Improved handling of component re-renders, preventing unnecessary API calls, and ensuring a smooth, responsive UI. Building for Scalability: Designed the architecture in a way that allows easy integration of upcoming features like pantry tracking and AI-driven food recommendations.

## What's next for Ambrosia
Pantry Management System: Users will be able to add scanned food items to a digital pantry, tracking expiry dates, dietary restrictions, and available ingredients. Recipe Recommendations: Based on the user’s pantry, dietary preferences, and expiring items, Ambrosia will suggest AI-generated meal ideas that minimize food waste. Enhanced Allergy & Health Warnings: Further improvements to filter analysis, highlighting potential health risks and suggesting better alternatives. Community-Driven Enhancements: Allowing users to contribute missing product details and dietary feedback to improve food data accuracy.

