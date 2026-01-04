import React from 'react'
import { useState } from 'react';
import axios from "axios";
import imageCompression from "browser-image-compression";
import { toast } from 'react-toastify';

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
            maxWidthOrHeight: 1024
        });

        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(compressedFile);
    };

    const generateBanner = async () => {
        setStatus("Generating...");

        await axios.post(
            "http://localhost:7000/api/generate-banner",
            {
                image,
                prompt
            },
        ).then((response) => {
            setgenerateBannerImages(response.data.imageUrls);
            toast.success(response.data.message);
            setStatus("Banners Generated Successfully.");
        }).catch((error) => {
            toast.error(error.response ? error.response.data.message : "Error occurred");
            setStatus("Error occurred.");
        });
    };
    return (
        <>
            <div style={{ padding: 30 }}>
                <h2>AI Banner Generator</h2>

                <input type="file" accept="image/*" onChange={handleImageUpload} />

                <br /><br />

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
                <br /><br />

                <button onClick={generateBanner}>Generate Banner</button>

                <p>{status}</p>

                <div>
                    <h4>Generated Banners:</h4>
                    {/* Display generated banner images here */}
                    {generateBannerImages.map((url, index) => (
                        <div key={index} style={{ marginBottom: 20 }}>
                            <img src={url} alt={`Generated Banner ${index + 1}`} width="300" />
                        </div>
                    ))}
                </div>

            </div>
        </>
    )
}

export default HuggingFaceTool