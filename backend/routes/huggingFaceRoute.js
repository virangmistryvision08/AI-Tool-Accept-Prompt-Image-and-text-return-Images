const express = require("express");
const { create_banner_images } = require("../controllers/huggingFaceController");
const router = express.Router();

router.post("/generate-banner", create_banner_images);

module.exports = router;