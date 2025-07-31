// ✅ Importation des fonctions nécessaires
import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database"; // <-- Ces imports manquaient
import { onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBVEItpTW9MRYedRzXnO3BAmb5xkKJRpEY",
  authDomain: "iot-dev-4c2ed.firebaseapp.com",
  databaseURL: "https://iot-dev-4c2ed-default-rtdb.firebaseio.com",
  projectId: "iot-dev-4c2ed",
  storageBucket: "iot-dev-4c2ed.appspot.com", // 🔧 correction du domaine
  messagingSenderId: "1048652605172",
  appId: "1:1048652605172:web:d4b96789abed78fbc4e0a1",
  measurementId: "G-XRZHCZRY3S"
};

// ✅ Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // <-- on initialise bien la base de données

export const listenToHumidity = (callback) => {
  const humidityRef = ref(database, "/capteurs/humidite");

  onValue(humidityRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      callback(null);
    }
  }, (error) => {
    console.error("Erreur d'écoute de l'humidité :", error);
    callback(null);
  });
};
