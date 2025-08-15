// Import required libraries
const express = require('express');
const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { CronJob } = require('cron');
const axios = require('axios');
require('dotenv').config();

// Express app setup
const app = express();
const port = process.env.PORT || 3000;

// middleware to parse JSON requests
app.use(express.json());

// DB setup, both creds are on .env
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    },
});

// Using Axios get top 3 financial news
async function getFinancialNews() {
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
        params: {
            category: 'business',
            language: 'en',
            pageSize: 3, // 3 news
            apiKey: process.env.NEWSAPI_KEY
        }
    });
    return response.data.articles;
}

// Generate newsletter using gemini (Note: I have to check the version)
async function generateNewsletterContent(newsItems) {
    const prompt = `
    Create a short financial newsletter with these 3 news items:
    1. ${newsItems[0].title} - ${newsItems[0].description}
    2. ${newsItems[1].title} - ${newsItems[1].description}
    3. ${newsItems[2].title} - ${newsItems[2].description}
    
    Format as HTML email with:
    - Simple greeting
    - 3 short news summaries
    - Brief closing
  `;

    const result = await model.generateContent(prompt);
    return result.response.text();
}

// Send newsletter to all subscribers
async function sendNewsletter() {
    try {
        // Get subscribers
        const { data: subscribers } = await supabase
            .from('subscribers')
            .select('email');

        if (!subscribers.length) return;

        // Get news and generate content
        const newsItems = await getFinancialNews(); // call the result we got from api
        const emailContent = await generateNewsletterContent(newsItems); //

        // Send emails
        for (const subscriber of subscribers) {
            await transporter.sendMail({
                from: process.env.SMTP_USER,
                to: subscriber.email,
                subject: "Daily Financial News",
                html: emailContent
            });
            console.log(`Sent to ${subscriber.email}`);
        }
    } catch (error) {
        console.error('Error sending newsletter:', error);
    }
}

// Schedule daily emails (weekdays at 8 AM)

// CronJob is new instance
new CronJob(
    '0 8 * * 1-5', // Cron expression (weekdays at 8 AM)
    sendNewsletter, // Function to execute
    null,
    true, // Start the job immediately
    'America/New_York' // Timezone
);

// API Endpoints

// check if running
app.get('/', (req, res) => {
    res.send('AI Newsletter Backend is running');
});

// Simple email subscription
app.post('/subscribe', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        await supabase
            .from('subscribers')
            .insert({ email });

        res.json({ message: 'Subscribed successfully' });
    } catch (error) {
        console.error('Subscription error:', error);
        res.status(500).json({ error: 'Subscription failed' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});