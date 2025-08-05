const express = require('express');
const nodemailer = require('nodemailer'); // for emailing directly from nodejs
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config()

const app = express(); // setting express server

const port = 3000 || process.env.PORT;

app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Main page endpoint
app.get('/',(req,res)=>{
    res.send('AI Newsletter Backend is running.');
})

// Create a transporter for SMTP 
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Port listening on either 3000 or .env.PORT
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
})

