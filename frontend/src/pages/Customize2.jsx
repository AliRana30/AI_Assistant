import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Customize2 = () => {
  const [assistantName, setAssistantName] = useState("");
  const { backendImage, frontendImage, selectedImage, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  const fetchImageAsFile = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], "assistant.jpg", { type: blob.type });
  };

 const handleAssistant = async () => {
  if (!assistantName || assistantName.length < 3) {
    alert("Assistant name must be at least 3 characters long.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("assistantName", assistantName);

    const file = backendImage ? frontendImage : selectedImage;
    formData.append("assistantImage", file); 

    
    const response = await axios.post("http://localhost:5000/update", formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    setUser(response.data);
    const assistantImage = formData.get("assistantImage")
    localStorage.setItem("assistantImage",JSON.stringify(assistantImage));

    localStorage.setItem("user", JSON.stringify(response.data));
    navigate("/");
  } catch (error) {
    console.error("Error creating assistant:", error.response?.data || error.message);
  }
};


  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-t from-black to-[#030353] px-4">
      <div className="absolute top-4 left-4">
        <a
          href="/customize"
          className="flex items-center text-white hover:text-blue-400 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="hidden sm:inline text-base font-medium">Back</span>
        </a>
      </div>

      <div className="flex flex-col items-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-opacity-80 rounded-lg py-10 px-4 sm:px-8 md:px-10 bg-[#18181b] shadow-lg">
        <h1 className="text-white text-2xl sm:text-3xl font-bold mb-6 text-center">
          Enter your assistant name
        </h1>

        <input
          type="text"
          placeholder="Name"
          value={assistantName}
          onChange={(e) => setAssistantName(e.target.value)}
          className="mb-6 px-4 py-2 rounded bg-gray-800 text-white focus:outline-none w-full text-base sm:text-lg"
        />

        {assistantName.length < 3 && (
          <p className="text-white text-sm sm:text-base text-center">
            *Name length should be more than 3 characters
          </p>
        )}

        {assistantName.length >= 3 && (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded mb-2 w-full transition-colors text-base sm:text-lg"
            onClick={handleAssistant}
          >
            Create your assistant
          </button>
        )}
      </div>
    </div>
  );
};

export default Customize2;
