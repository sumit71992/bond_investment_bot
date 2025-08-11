import TelegramBot from "node-telegram-bot-api";
import express from "express";
import cron from "node-cron";
import dotenv from "dotenv";
dotenv.config();

// Replace with your bot token from BotFather
const token = process.env.TELEGRAM_KEY;
const bot = new TelegramBot(token, { polling: true });

let chatId = process.env.CHAT_ID;
const record = [
  {
    name: "Navi May'25",
    price: 9911.39,
    quantity: 2,
    date: "21",
    interest: {
      30: 174.25,
      31: 180.05,
      28: 162.63,
      29: 162.63,
    },
    total: 20000,
    lastDate: "2027-05-21",
    company: "Wint Wealth",
  },
  {
    name: "Manba Jul'25",
    price: 10055.29,
    quantity: 1,
    date: "27",
    interest: {
      30: 92.47,
      31: 95.55,
      28: 86.30,
      29: 86.30,
    },
    total: 5000,
    secondTotal:5000,
    lastDate: "2027-06-27",
    secondLastDate:"2027-07-27",
    company: "Wint Wealth",
  },
  {
    name: "Wint Capital Aug'25",
    price: 9990.01,
    quantity: 4,
    date: "19",
    interest: {
      30: 366.92,
      31: 379.12,
      28: 342.44,
      29: 342.44,
    },
    total: 40000,
    lastDate: "2026-08-19",
    company: "Wint Wealth",
  },
  {
    name: "U Gro Jun'25",
    price: 9853.8,
    quantity: 1,
    date: "",
    interest: {
      30: 82.36,
      31: 85.1,
      28: 76.87,
    },
    total: "1000",
    lastDate: "",
    company: "Wint Wealth",
  },
  {
    name: "Wint Capital Aug'25",
    price: 9986.9,
    quantity: 1,
    date: "24",
    interest: {
      30: 82.20,
      31: 84.90,
      28: 76.70,
      29: 76.70,
    },
    total: 10000,
    lastDate: "2026-10-24",
    company: "Wint Wealth",
  },
  {
    name: "Ugro Capital Limited",
    price: 9917.65,
    quantity: 1,
    date: "7",
    interest: {
      30: 82.36,
      31: 85.1,
      28: 76.87,
      29: 76.87,
    },
    total: 10000,
    lastDate: "2026-08-07",
    company: "Bidd",
  },
]; // will be set when user sends /start
let msg =
  "<b>Good morning!</b> 🌞\nOm namoh bhagwatey devi kushmandni sarvakarya prishdhni sarva nimit prakashni ahi ahi twar twar varam dihi lihi maatangani lihi satyam bruhi bruhi swaha";
// Detect chat ID when user starts the bot
bot.onText(/\/start/, (msg) => {
  chatId = msg.chat.id;
  bot.sendMessage(chatId, msg, { parse_mode: "HTML" });
});
bot.on("message", (message) => {
  console.log("rrr", message);
  bot.sendMessage(chatId, msg, { parse_mode: "HTML" });
});

// Send daily message at 9:00 AM
cron.schedule(
  "0 6 * * *",
  () => {
    const now = new Date();
    const todayDay = String(now.getDate()); // today's date number

    // Filter records that match today's date
    const matchingRecords = record.filter((item) => item.date === todayDay);
    const prevMonth = now.getMonth(); // Current month index (0-11)
    const prevYear = now.getFullYear();

    // Date(year, month, day=0) → last day of previous month
    const daysInPrevMonth = new Date(prevYear, prevMonth, 0).getDate();
    if (matchingRecords.length > 0) {
      const totalInterest = matchingRecords.reduce((sum, item) => {
        return sum + (item.interest?.[daysInPrevMonth] || 0);
      }, 0);

      // Build aligned table
      let tableRows = matchingRecords
        .map((item) => {
          const interest = item.interest?.[daysInPrevMonth] || 0;
          const total = interest * item.quantity;
          return `${item.company.padEnd(13)} ${
            item.name
          },   ₹${interest} qty: ${String(item.quantity)} = ₹${total.toFixed(2)}`;
        })
        .join("\n");

      msg = `<b>Good morning!</b> 🌞\nOm namoh bhagwatey devi kushmandni sarvakarya prishdhni sarva nimit prakashni ahi ahi twar twar varam dihi lihi maatangani lihi satyam bruhi bruhi swaha\n\nToday you will get total interest of ₹<b>${totalInterest.toFixed(
        2
      )}</b>\n<pre>${tableRows}</pre>`;
    }
    if (chatId) {
      bot.sendMessage(chatId, msg, { parse_mode: "HTML" });
    } else {
      console.log("⚠ No chat ID yet. User has not started the bot.");
    }
  },
  {
    timezone: "Asia/Kolkata",
  }
);

const app = express();
app.get("/", (req, res) => res.send("Bot is running"));
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is listening");
});
