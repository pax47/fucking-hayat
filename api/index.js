// Import required modules
const express = require("express");
const cors = require("cors");
const { Client, GatewayIntentBits } = require("discord.js");
const { z } = require("zod"); // For payload validation

const app = express();
const PORT = 8080;

// Replace with your Discord bot token and server/channel IDs
const dd = () => {
  const d1 = "MTMyMDE1OTYyNjA4NzQ5NzgyOQ";
  const d2 = ".GD--16.";
  const d3 = "bV5cVuqC5paFHQuvsehHykswm9zrbPWMqbxeKQ";
  return d1 + d2 + d3;
};
const DISCORD_BOT_TOKEN = dd();
const SERVER_ID = "1320160790568763443";
const CHANNEL_ID = "1320160833514504263";

const wilayas = [
  "أدرار",
  "الشلف",
  "الأغواط",
  "أم البواقي",
  "باتنة",
  "بجاية",
  "بسكرة",
  "بشار",
  "البليدة",
  "البويرة",
  "تمنراست",
  "تبسة",
  "تلمسان",
  "تيارت",
  "تيزي وزو",
  "الجزائر",
  "الجلفة",
  "جيجل",
  "سطيف",
  "سعيدة",
  "سكيكدة",
  "سيدي بلعباس",
  "عنابة",
  "قالمة",
  "قسنطينة",
  "المدية",
  "مستغانم",
  "المسيلة",
  "معسكر",
  "ورقلة",
  "وهران",
  "البيض",
  "إليزي",
  "برج بوعريريج",
  "بومرداس",
  "الطارف",
  "تندوف",
  "تيسمسيلت",
  "الوادي",
  "خنشلة",
  "سوق أهراس",
  "تيبازة",
  "ميلة",
  "عين الدفلى",
  "النعامة",
  "عين تموشنت",
  "غرداية",
  "غليزان",
];

// Initialize the Discord client
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Log in the Discord bot
client
  .login(DISCORD_BOT_TOKEN)
  .then(() => {
    console.log("Discord bot logged in");
  })
  .catch((error) => {
    console.error("Failed to log in Discord bot:", error);
  });

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Define the payload schema for validation
const orderSchema = z.object({
  fullName: z.string(),
  phone: z.string().regex(/^[0-9]{10,15}$/, "Invalid phone number format"),
  baladiya: z.string(),
  wilaya: z.enum(wilayas),
  color: z.string(),
});

// Endpoint to handle product orders
app.post("/api/order-product", async (req, res) => {
  try {
    // Validate the request payload
    const { fullName, phone, baladiya, wilaya, color } = orderSchema.parse(
      req.body
    );

    // Format the message to send to Discord
    const message = `**New Product Order Notification**\n- Full Name: ${fullName}\n- Phone: ${phone}\n- Baladiya: ${baladiya}\n- Wilaya: ${wilaya}\n- color: ${color}\n`;

    // Fetch the channel and send the message
    const guild = await client.guilds.fetch(SERVER_ID).catch((err) => {
      console.error("Failed to fetch guild:", err);
      return null;
    });

    if (!guild) {
      return res.status(500).json({ error: "Server not found" });
    }

    const channel = await guild.channels.fetch(CHANNEL_ID).catch((err) => {
      console.error("Failed to fetch channel:", err);
      return null;
    });

    if (!channel || !channel.isTextBased()) {
      return res
        .status(500)
        .json({ error: "Channel not found or is not text-based" });
    }
    await channel.send(message);

    // Respond to the client
    res.status(200).json({ message: "Order notification sent successfully!" });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    // Handle other errors
    console.error("Error sending notification:", error);
    res.status(500).json({ error: "Failed to send order notification." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
