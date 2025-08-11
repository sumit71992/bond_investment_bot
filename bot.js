import TelegramBot from "node-telegram-bot-api";
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
    date: "11",
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
    name: "Manba Jul'25",
    price: 10055.29,
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
    price: 9990.01,
    quantity: 4,
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
    name: "U Gro Jun'25",
    price: 9853.8,
    quantity: 1,
    date: "11",
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
    date: "11",
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
    name: "Ugro Capital Limited",
    price: 9917.65,
    quantity: 1,
    date: "7",
    interest: {
      30: 82.36,
      31: 85.1,
      28: 76.87,
    },
    total: "1000",
    lastDate: "2026-08-07",
    company: "Bidd",
  },
]; // will be set when user sends /start
let msg =
  "<b>Good morning!</b> 🌞\nOm namoh bhagwatey devi kushmandni sarvakarya prishdhni sarva nimit prakashni ahi ahi twar twar varam dihi lihi maatangani lihi satyam bruhi bruhi swaha";
// Detect chat ID when user starts the bot
bot.onText(/\/start/, (msg) => {
  chatId = msg.chat.id;
  bot.sendMessage(chatId, msg);
});

// Send daily message at 9:00 AM
cron.schedule(
  "30 14 * * *",
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
        return sum + (item.interest?.[daysInPrevMonth] * item.quantity || 0);
      }, 0);

      // Build aligned table
      let tableRows = matchingRecords
        .map((item) => {
          const interest = item.interest?.[daysInPrevMonth] || 0;
          const total = interest * item.quantity;
          return `${item.company.padEnd(13)} ${
            item.name
          },   ₹${interest} x ${String(item.quantity)} = ₹${total.toFixed(2)}`;
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
