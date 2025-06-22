import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const Card = () => {

      const robotImages = [
    "/AI(1).jpg",
    "/AI(2).jpg",
    "/AI(3).jpg",
    "/AI(4).jpg",
  ];

  const { selectedImage,setSelectedImage ,setFrontEndImage , setBackEndImage} = useContext(UserContext);
return (
    <div
        style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
            padding: "20px",
        }}
    >
        {robotImages.map((src, index) => (
            <img
                key={index}
                src={src}
                alt={`Robot ${index + 1}`}
                style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    boxShadow:
                        selectedImage === src
                            ? "0 0 16px 4px white, 0 4px 8px rgba(0,0,0,0.1)"
                            : "0 4px 8px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    backgroundColor: "white",
                    border: selectedImage === src ? "2px solid white" : "none",
                    transition: "box-shadow 0.2s, border 0.2s",
                }}
                onClick={()=>{setSelectedImage(src)
                    setFrontEndImage(null)
                    setBackEndImage(null)
                }}
            />
        ))}
    </div>
)
}

export default Card
