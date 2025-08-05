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
    user: process.env.SMTP_USER
  },
});

app.post('/subscribers', async(req,res)=>{
    
    const {email} = req.body; // email inputted on request body

    // Input validation
    if(!email){
        return res.status(400).json({error: 'Email is required.'})
    }
    // else if email is present
    try{
        // Insert new email into subscribers table
        const { data, error } = await supabase
            .from('subscribers')
            .insert({ email });
        if (error) {
            // Check for a specific error code for unique constraint violation
            if (error.code === '23505') {
                return res.status(409).json({ error: 'This email is already subscribed.' });
            }
            // For any other Supabase-related errors
            console.error('Supabase error:', error);
            return res.status(500).json({ error: 'Failed to subscribe due to a server error.' });
        }
        // If the insertion was successful
        console.log(`New subscriber added: ${email}`);
        res.status(201).json({ message: 'Subscription successful.' });
        }

    catch(err){
        // Catch any other errors    
        console.log(`New subscriber added: ${email}`);
        res.status(201).json({error: 'An unexpected error occurred'})
    }
});


// Port listening on either 3000 or .env.PORT
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
})

