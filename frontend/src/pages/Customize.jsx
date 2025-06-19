import React, { useContext, useRef } from "react";
import { RiImageAddLine } from "react-icons/ri";
import { UserContext } from "../context/UserContext";
import { Button } from "antd";
import Card from "../../components/Card";
import { useNavigate } from "react-router-dom";

const Customize = () => {
  const inputImage = useRef(null);
  const {
    frontendImage,
    setFrontEndImage,
    backendImage,
    setBackEndImage,
    selectedImage,
    setSelectedImage,
  } = useContext(UserContext);

  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // frontend preview
    setFrontEndImage(URL.createObjectURL(file));
    console.log("Uploaded file (for frontend):", URL.createObjectURL(file));
    // Mark selection source
    setSelectedImage("input");

    // Store file for backend
    setBackEndImage(file);

    console.log("Uploaded file (for backend):", file);

    const reader = new FileReader();
    reader.onloadend = () => {
      console.log("Image preview (base64):", reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-8 bg-gradient-to-t from-black to-[#030353] px-4 py-10">
      {/* Robot image cards */}
      <Card />

      {/* Upload Image Box */}
      <div
        className={`w-[200px] h-[200px] rounded-[10px] shadow-md flex items-center justify-center bg-black cursor-pointer ${
          selectedImage === "input"
            ? "border-2 border-white shadow-[0_0_16px_4px_rgba(255,255,255,0.6)]"
            : ""
        }`}
        onClick={() => inputImage.current.click()}
      >
        {!frontendImage ? (
          <RiImageAddLine className="text-white text-3xl" />
        ) : (
          <img
            src={frontendImage}
            alt="Uploaded"
            className="w-full h-full object-cover rounded-[10px]"
          />
        )}
      </div>


{backendImage && (
  <p className="text-white text-sm mt-2">
    Backend file name: {backendImage.name}
  </p>
)}

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        hidden
        ref={inputImage}
        onChange={handleImage}
      />


      {/* Next Button */}
     {selectedImage && (
  <Button
    className="w-[100px] h-[40px] bg-blue-600 text-white hover:bg-blue-700"
    onClick={() => navigate("/customize2")}
  >
    Next
  </Button>
)}

    </div>
  );
};

export default Customize;
