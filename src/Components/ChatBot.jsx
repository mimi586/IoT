import { useEffect, useState } from "react";
import { Avatar, Button, Typography } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { FaRobot } from "react-icons/fa";
import { CheckCircle } from "@mui/icons-material";
import { listenToHumidity } from "./firebaseConfig";


export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [waitingForOK, setWaitingForOK] = useState(false);
  const [latestHumidity, setLatestHumidity] = useState(null);

  // 👂 Écoute les changements d'humidité
  useEffect(() => {
    listenToHumidity((newHumidity) => {
      if (newHumidity !== null && newHumidity !== latestHumidity) {
        handleBotResponse(newHumidity);
        setLatestHumidity(newHumidity);
      }
    });
  }, [latestHumidity]);

  const handleBotResponse = (humidite) => {
    let response = "";

    if (humidite < 30) {
      response = `🌧️ Humidité : ${humidite}%\nVeuillez arroser vos plantes !`;
    } else if (humidite < 60) {
      response = `🌥️ Humidité : ${humidite}%\nL'humidité est normale.`;
    } else {
      response = `🌤️ Humidité : ${humidite}%\nL'humidité est ambiante.`;
    }

    setMessages((prev) => [...prev, { from: "bot", text: response }]);
   
    setWaitingForOK(true);
  };

  const handleOK = () => {
    setMessages((prev) => [...prev, { from: "user", text: "✅ OK, j’ai noté." }]);
    setWaitingForOK(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-auto mt-10 border">
      <Typography variant="h5" className="text-center mb-4 text-blue-600 font-bold">
        🤖 Assistant Jardin – Chat IA
      </Typography>

      <div className="h-72 overflow-y-auto p-3 bg-[#f0f2f5] rounded-lg space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.from === "bot" && (
              <Avatar sx={{ bgcolor: deepPurple[500], width: 30, height: 30, mr: 1 }}>
                <FaRobot size={16} />
              </Avatar>
            )}
            <div
              className={`max-w-[75%] px-4 py-2 text-sm rounded-2xl shadow-md whitespace-pre-line transition-all duration-300 ease-in-out ${
                msg.from === "bot"
                  ? "bg-[#e4e6eb] text-black rounded-bl-none"
                  : "bg-[#0084ff] text-white rounded-br-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        {waitingForOK && (
          <Button
            fullWidth
            variant="contained"
            startIcon={<CheckCircle />}
            sx={{
              backgroundColor: "#4CAF50",
              color: "#fff",
              borderRadius: "9999px",
              textTransform: "none",
              fontWeight: "bold",
              '&:hover': {
                backgroundColor: "#45A049",
              },
            }}
            onClick={handleOK}
          >
            OK, j’ai noté !
          </Button>
        )}
      </div>
    </div>
  );
}
