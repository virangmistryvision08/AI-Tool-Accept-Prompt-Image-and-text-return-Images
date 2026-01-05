const axios = require("axios");

const create_banner_images = async (req, res) => {
  try {
    const { image, prompt } = req.body;

    if (!image || !prompt) {
      return res.status(400).json({ error: "Image and prompt are required" });
    }
    const payload = {
      input: {
        prompt: `
        Use the uploaded product image as the exact product reference.

Create a professional marketing banner where a stylish female model is advertising the product.

Rules (VERY IMPORTANT):
- The product must look EXACTLY like the uploaded image
- Do NOT change product color, shape, logo, or design
- The female model should be holding, wearing, or interacting naturally.
- The model must look realistic, confident, and attractive
- The focus should still remain on the product

Scene & Style:
- Commercial advertisement photoshoot
- Clean studio or lifestyle background
- Soft professional lighting
- Modern, premium, e-commerce look
- Natural pose, friendly expression

Marketing Feel:
- Looks like a real brand advertisement
- Suitable for website banners and social media ads
- Space for price and offer text

Quality:
- Ultra-realistic
- Sharp focus
- High resolution
- Professional photography

        
product Details -
        ${prompt}`,
        image,
      },
    };
    const count = 2;
    const imageUrls = [];

    for (let i = 1; i <= count; i++) {
      console.log(`Generating Image - ${i}`);

      const response = await axios.post(
        "https://router.huggingface.co/replicate/v1/models/black-forest-labs/flux-2-dev/predictions",
        payload,
        {
          headers: {
            Authorization: `Bearer ${process.env.HF_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          timeout: 120000,
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        }
      );
      imageUrls.push(response.data?.urls?.stream);
    }

    return res
      .status(201)
      .json({ status: true, imageUrls, message: "Banner Images Created." });
  } catch (error) {
    console.log(
      error.response ? error.response.data.error : error.message,
      "error"
    );
    res.status(500).json({
      status: false,
      message: error.response ? error.response.data.error : error.message,
    });
  }
};

module.exports = {
  create_banner_images,
};
