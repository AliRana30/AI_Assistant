import React, { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Home = () => {
  const { user, setUser, frontendImage, geminiResponse, history,setHistory ,selectedImage} = useContext(UserContext);
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [checking, setChecking] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [speechText, setSpeechText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected"); // disconnected, connecting, connected, error
  
  // Refs for managing speech recognition
  const recognitionRef = useRef(null);
  const restartTimeoutRef = useRef(null);
  const isManualStopRef = useRef(false);
  const lastSpeechTimeRef = useRef(null);

  
  const token = localStorage.getItem("token");

  // Get current user 
  const getUser = async() => {
    const userFromStorage = JSON.parse(localStorage.getItem("user"));
    const emailFromLocalStorage = localStorage.getItem("email");
    if (!token || token.split(".").length !== 3) {
      localStorage.clear();
      navigate("/login");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const emailFromToken = decoded.email;
      if (!emailFromLocalStorage || emailFromLocalStorage !== emailFromToken) {
        localStorage.clear();
        navigate("/login");
      } else {
        setUser(userFromStorage);
        setUserEmail(emailFromToken);
      }
    } catch (err) {
      localStorage.clear();
      navigate("/login");
    } finally {
      setChecking(false);
    }
  }

  // Speak function
  const speak = (text) => {
    const synth = new SpeechSynthesisUtterance(text);
    synth.rate = 0.9;
    synth.pitch = 1;
    synth.volume = 0.8;
    window.speechSynthesis.speak(synth);
  }

  const handlecommands = async (data) => {
    const { type, input } = data;
    const query = encodeURIComponent(input);
    
    // Function to safely open URLs
    const safeOpen = (url, fallbackMessage) => {
      try {
          window.open(url, "_blank", "noopener,noreferrer");
      } catch (error) {
        speak(`Sorry, I couldn't open ${fallbackMessage}. Please try manually.`);
      }
    };

    switch (type) {
      case 'youtube_search':
        safeOpen(`https://www.youtube.com/results?search_query=${query}`, "YouTube search");
        break;
      case 'google_search':
        safeOpen(`https://www.google.com/search?q=${query}`, "Google search");
        break;
      case 'wikipedia_search':
        safeOpen(`https://en.wikipedia.org/wiki/${query}`, "Wikipedia");
        break;
      case 'maps_search':
      case 'open_maps':
        safeOpen(`https://www.google.com/maps/search/${query}`, "Google Maps");
        break;
      case 'weather_show':
        safeOpen(`https://www.google.com/search?q=weather+${query}`, "Weather search");
        break;
      case 'news_update':
        safeOpen(`https://news.google.com/search?q=${query}`, "Google News");
        break;
      case 'translate':
        safeOpen(`https://translate.google.com/?sl=auto&tl=en&text=${query}&op=translate`, "Google Translate");
        break;
      case 'calculator_open':
        safeOpen(`https://www.google.com/search?q=calculator`, "Calculator");
        break;
      case 'set_alarm':
      case 'set_reminder':
      case 'timer':
      case 'reminder':
        speak("Reminder functionality is not supported in browser. Please use your device's built-in reminder app.");
        break;
      case 'facebook_open':
        safeOpen(`https://www.facebook.com`, "Facebook");
        break;
      case 'instagram_open':
        safeOpen(`https://www.instagram.com`, "Instagram");
        break;
      case 'play_music':
        safeOpen(`https://music.youtube.com/search?q=${query}`, "YouTube Music");
        break;
      case 'currency_convert':
        safeOpen(`https://www.google.com/search?q=${query}+currency+converter`, "Currency converter");
        break;
      case 'unit_convert':
        safeOpen(`https://www.google.com/search?q=${query}+unit+converter`, "Unit converter");
        break;
      case 'email_open':
        safeOpen(`https://mail.google.com`, "Gmail");
        break;
      case 'whatsapp_open':
        safeOpen(`https://web.whatsapp.com`, "WhatsApp Web");
        break;
      case 'twitter_open':
      case 'x_open':
        safeOpen(`https://twitter.com`, "Twitter/X");
        break;
      case 'linkedin_open':
        safeOpen(`https://www.linkedin.com`, "LinkedIn");
        break;
      case 'github_open':
        safeOpen(`https://github.com`, "GitHub");
        break;
      case 'netflix_open':
        safeOpen(`https://www.netflix.com`, "Netflix");
        break;
      case 'amazon_open':
        safeOpen(`https://www.amazon.com`, "Amazon");
        break;
      case 'tell_joke':
      case 'get_date':
      case 'get_day':
      case 'get_month':
      case 'get_time':
      case 'general':
      case 'greeting':
      case 'thanks':
        // These are handled by the AI response, no navigation needed
        break;
      default:
        speak("I'm not sure how to handle that command yet.");
    }
  };

  // Check popup permissions
  const checkPopupPermission = () => {
    try {
      const testWindow = window.open('', '_blank', 'width=1,height=1');
      if (testWindow) {
        testWindow.close();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  // Process speech input
  const processSpeechInput = async (transcript) => {
    if (transcript.trim() === "" || isProcessing) return;
    
    setIsProcessing(true);
    setSpeechText(transcript);
    
    try {
      
      const data = await geminiResponse(transcript);
      
      if (data && data.response) {
        speak(data.response);
        
        if (data.type && data.type !== 'general' && data.type !== 'tell_joke' && 
            data.type !== 'get_date' && data.type !== 'get_day' && 
            data.type !== 'get_month' && data.type !== 'get_time' && 
            data.type !== 'greeting' && data.type !== 'thanks') {
          
          if (!checkPopupPermission()) {
            speak("Please allow popups for this website to open external links. You can enable this in your browser settings.");
          }
        }
        
        handlecommands(data);
        setHistory(prev => [
          ...prev,
          {
            speechText: transcript,
            text: data.response,
            command: data.type,
            input: data.input,
            timestamp: new Date().toISOString()
          }
        ]);
      }

    } catch (error) {
      speak("Sorry, I encountered an error processing your request.");
    } finally {
      setIsProcessing(false);
      // Clear speech text after a delay
      setTimeout(() => setSpeechText(""), 3000);
    }
  };

  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep listening continuously
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    let silenceTimer = null;

    recognition.onstart = () => {
      setConnectionStatus("connected");
      lastSpeechTimeRef.current = Date.now();
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Show interim results
      if (interimTranscript) {
        setSpeechText(interimTranscript);
        lastSpeechTimeRef.current = Date.now();
      }

      // Process final results
      if (finalTranscript.trim() !== "") {
        clearTimeout(silenceTimer);
        processSpeechInput(finalTranscript.trim());
        lastSpeechTimeRef.current = Date.now();
      }
    };

    recognition.onerror = (event) => {
      setConnectionStatus("error");
      
      // Handle different types of errors
      switch (event.error) {
        case 'network':
          speak("Network error. Please check your internet connection.");
          break;
        case 'not-allowed':
          speak("Microphone access denied. Please allow microphone access.");
          break;
        case 'no-speech':
          break;
        case 'audio-capture':
          speak("No microphone found. Please check your microphone.");
          break;
        default:
          if (!isManualStopRef.current) {
            restartRecognition();
          }
      }
    };

    recognition.onend = () => {
      setConnectionStatus("disconnected");
      
      // Auto-restart if not manually stopped
      if (!isManualStopRef.current && isListening) {
        restartRecognition();
      }
    };

    return recognition;
  };

  // Restart recognition with delay
  const restartRecognition = () => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
    }
    
    setConnectionStatus("connecting");
    restartTimeoutRef.current = setTimeout(() => {
      if (isListening && !isManualStopRef.current) {
        try {
          if (recognitionRef.current) {
            recognitionRef.current.start();
          }
        } catch (error) {
          console.error("Error restarting recognition:", error);
          // Try again after a longer delay
          setTimeout(() => {
            if (isListening && !isManualStopRef.current) {
              restartRecognition();
            }
          }, 2000);
        }
      }
    }, 1000);
  };

  // Start continuous listening
  const startListening = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = initializeSpeechRecognition();
    }

    if (!recognitionRef.current) return;

    isManualStopRef.current = false;
    setIsListening(true);
    setConnectionStatus("connecting");
    setSpeechText("");

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error("Error starting recognition:", error);
      setConnectionStatus("error");
      // Try again after a short delay
      setTimeout(() => {
        if (isListening) {
          restartRecognition();
        }
      }, 1000);
    }
  };

  // Stop listening
  const stopListening = () => {
    isManualStopRef.current = true;
    setIsListening(false);
    setConnectionStatus("disconnected");
    setSpeechText("");

    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error("Error stopping recognition:", error);
      }
    }
  };

  // Toggle listening
  const handleClickToSpeak = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Get status indicator
  const getStatusIndicator = () => {
    switch (connectionStatus) {
      case "connected":
        return { color: "bg-green-500", text: "Connected" };
      case "connecting":
        return { color: "bg-yellow-500", text: "Connecting..." };
      case "error":
        return { color: "bg-red-500", text: "Error" };
      default:
        return { color: "bg-gray-400", text: "Disconnected" };
    }
  };

  const statusIndicator = getStatusIndicator();

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopListening();
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    getUser();
  }, [token, navigate, setUser]);

  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);
  
  
  if (checking) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
      <div className="text-center text-gray-500">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 pt-10">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
        <div className="text-center space-y-6 max-w-lg mx-auto">
          {/* Assistant Image */}
          <div className="relative inline-block">
            <img
              src={frontendImage || "/AI(1).jpg"}
              alt="Your AI Assistant"
              className="w-36 h-36 object-cover rounded-full shadow-2xl border-4 border-purple-500 mx-auto"
            />
            {/* Status Indicator */}
            <div className={`absolute -bottom-2 -right-2 w-8 h-8 ${statusIndicator.color} rounded-full border-3 border-gray-800 shadow-lg flex items-center justify-center`}>
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Assistant Name */}
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-white">
              {user?.assistantName || "Your Assistant"}
            </h2>
            <p className="text-lg text-gray-300">
              {isListening ? "Listening..." : "Ready to assist you"}
            </p>
          </div>

          {/* Connection Status */}
          {isListening && (
            <div className="flex items-center justify-center space-x-2 text-sm">
              <div className={`w-2 h-2 ${statusIndicator.color} rounded-full animate-pulse`}></div>
              <span className="text-gray-400">{statusIndicator.text}</span>
            </div>
          )}

          {/* Animated Visual Indicator - Reduced size */}
          <div className="flex justify-center">
            <div className="relative">
              {isListening ? (
                // Listening animation - smaller size
                <div className="w-20 h-20 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-ping opacity-30"></div>
                    <div className="absolute inset-3 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                // Idle state - smaller size
                <div className="w-20 h-20 flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Speech Recognition Area */}
          {speechText && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-600 shadow-lg p-4 mx-4">
              <p className="text-sm text-gray-400 mb-2">
                {isProcessing ? "Processing..." : "You said:"}
              </p>
              <p className="text-gray-200 font-medium">{speechText}</p>
            </div>
          )}

          {/* Action Buttons - Removed negative margin */}
          <div className="flex flex-col space-y-2 px-4">
            {/* Click to Speak Button */}
            <button
              onClick={handleClickToSpeak}
              disabled={isProcessing}
              className={`inline-flex items-center justify-center space-x-3 px-8 py-3 rounded-xl font-semibold text-lg shadow-lg border-2 transition-all duration-200 transform hover:scale-105 ${
                isListening 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-red-500 shadow-red-500/20' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-purple-500 shadow-purple-500/20'
              } ${isProcessing ? 'opacity-50 cursor-not-allowed transform-none' : ''}`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isListening ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                )}
              </svg>
              <span>
                {isListening ? 'Stop Listening' : 'Start Continuous Listening'}
              </span>
            </button>

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="flex items-center justify-center space-x-2 text-purple-400">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                <span className="text-sm font-medium">Processing your request...</span>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              </div>
            )}
          </div>
          {/* Instructions */}
          <div className="text-sm text-gray-400 space-y-2 max-w-md mx-auto bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            <p>💡 <strong className="text-purple-400">Tip:</strong> Click "Start Continuous Listening" to keep the assistant active</p>
            <p>🎤 The assistant will process each command and continue listening</p>
            <p>🔴 Click "Stop Listening" when you're done</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;