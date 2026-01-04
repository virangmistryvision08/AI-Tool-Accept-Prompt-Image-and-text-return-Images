const axios = require("axios");

const create_banner_images = async (req, res) => {
    try {
        const { image, prompt } = req.body;

        if (!image || !prompt) {
            return res.status(400).json({ error: "Image and prompt are required" });
        }
        const payload = {
            input: {
                prompt,
                image
            }
        };
        const count = 3;
        const imageUrls = [];

        for (let i = 1; i <= count; i++) {
            console.log(`Generating Image - ${i}`);

            const response = await axios.post(
                "https://router.huggingface.co/replicate/v1/models/black-forest-labs/flux-2-dev/predictions",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.HF_ACCESS_TOKEN}`,
                        "Content-Type": "application/json"
                    },
                    timeout: 120000,
                    maxBodyLength: Infinity,
                    maxContentLength: Infinity,
                }
            );
            imageUrls.push(response?.config?.data?.urls?.stream);
        }

        return res.status(201).json({ status: true, imageUrls, message: "Banner Images Created." });
    } catch (error) {
        console.log(error.response ? error.response.data.error : error.message, 'error')
        res.status(500).json({ status: false, message: error.response ? error.response.data.error : error.message });
    }
}

module.exports = {
    create_banner_images
}