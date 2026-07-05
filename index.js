require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectToMongo = require("./db");

connectToMongo();

const app = express();

const cors = require("cors");

app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "https://inotebook-frontend-ruddy.vercel.app/"
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    })
);
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "🚀 iNotebook Backend is Live!"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});