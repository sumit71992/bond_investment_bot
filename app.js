import express from "express";
import bot from "./bot.js"; // your Telegram bot file

const app = express();
app.get("/", (req, res) => res.send("Bot is running"));
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is listening");
});
