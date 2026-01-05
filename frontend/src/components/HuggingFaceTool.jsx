import React from "react";
import { useState } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { toast } from "react-toastify";

const HuggingFaceTool = () => {
  const [image, setImage] = useState("");
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("");
  const [generateBannerImages, setgenerateBannerImages] = useState([]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      toast.error("Max 3MB image allowed");
      return;
    }

    const compressedFile = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(compressedFile);
  };

  const generateBanner = async () => {
    setStatus("Generating...");

    if (image === "" || prompt === "") {
      toast.error("Enter Image and Prompt Both!");
    }

    await axios
      .post("http://localhost:7000/api/generate-banner", {
        image,
        prompt,
      })
      .then((response) => {
        setgenerateBannerImages(response.data.imageUrls);
        toast.success(response.data.message);
        setStatus("Banners Generated Successfully.");
      })
      .catch((error) => {
        toast.error(
          error.response ? error.response.data.message : error.message
        );
        setStatus("Error occurred.");
      });
  };
  return (
    <>
      <div style={{ padding: 30 }}>
        <h2>AI Banner Generator</h2>

        <input type="file" accept="image/*" onChange={handleImageUpload} />

        <br />
        <br />

        <textarea
          placeholder="Enter prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          cols={50}
        />

        {image && (
          <>
            <h4>Preview:</h4>
            <img src={image} width="150" />
          </>
        )}
        <br />
        <br />

        <button onClick={generateBanner}>Generate Banner</button>

        <p>{status}</p>

        <div>
          {generateBannerImages.length > 0 && <h4>Generated Banners:</h4>}

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "10px",
            }}
          >
            {generateBannerImages.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Generated Banner ${index + 1}`}
                width="150"
                style={{
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HuggingFaceTool;
