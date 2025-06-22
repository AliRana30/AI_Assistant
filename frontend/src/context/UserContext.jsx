import React, { useState, useEffect, createContext } from 'react';
import Cookies from 'js-cookie';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [frontendImage, setFrontEndImage] = useState("");
  const [backendImage, setBackEndImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [history, setHistory] = useState([]);

  // Get gemini response using consistent fetch approach
  const geminiResponse = async (command) => {
    try {
      console.log('Sending command to gemini:', command);
      
      // Try multiple ways to get the token
      const tokenFromStorage = localStorage.getItem('token');
      const tokenFromCookies = Cookies.get('token');
      
      console.log('Debug gemini token info:');
      console.log('- localStorage token:', tokenFromStorage);
      console.log('- cookies token:', tokenFromCookies);

      const token = tokenFromStorage || tokenFromCookies;

      if (!token) {
        console.error('No authentication token found for gemini request');
        return { response: "Error: Please login to use the assistant" };
      }

      // Use the same URL pattern as other components
      const baseURL = import.meta.env.VITE_BASE_URL || 'https://backend-production-35a0.up.railway.app';
      const apiUrl = import.meta.env.DEV ? '/api/assistant' : `${baseURL}/assistant`;

      console.log('Making gemini request to:', apiUrl);
      console.log('With token:', token.substring(0, 20) + '...');

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ command })
      });

      console.log('Gemini response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          // Clear invalid tokens
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          Cookies.remove('token');
          return { response: "Error: Session expired. Please login again." };
        }
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Assistant request failed');
      }

      const data = await response.json();
      console.log('Gemini response data:', data);

      return data;
      
    } catch (err) {
      const msg = err.message || 'Failed to get response from assistant';
      console.error("Failed to get gemini:", msg);
      return { response: "Error: " + msg };
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const assistantImage = localStorage.getItem("assistantImage");
    if (storedUser) {
      setUser(storedUser);
      setFrontEndImage(assistantImage); 
    }

    const storedHistory = JSON.parse(localStorage.getItem('history')) || [];
    setHistory(storedHistory);
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        frontendImage,
        setFrontEndImage,
        backendImage,
        setBackEndImage,
        selectedImage,
        setSelectedImage,
        geminiResponse,
        history, 
        setHistory
      }}
    >
      {children}
    </UserContext.Provider>
  );
};