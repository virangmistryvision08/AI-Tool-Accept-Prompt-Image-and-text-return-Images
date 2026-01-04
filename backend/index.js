require("dotenv").config();
const express = require("express");
const app = express();
const port = +process.env.PORT || 7000;
const huggingFaceRoute = require("./routes/huggingFaceRoute");
const cors = require("cors");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

app.use("/api", huggingFaceRoute);

app.listen(port, () => {
    console.log("Server Started At PORT -", port);
});