# 📰 FiNews.AI 

_A Node.js web app that automatically sends the latest news to subscribers via email._  


## ✨ Features  
- **Daily automated news delivery** – Subscribers receive curated updates.  
- **AI-powered content** – Uses **Gemini 1.5 Flash** for smart summaries or filtering.  
- **Easy subscription management** – Built with **Supabase** for scalable storage.  
- **Reliable emailing** – **Nodemailer** ensures smooth delivery.  

## 🛠 Tech Stack  
- **Backend**: Node.js  
- **Database/Auth**: Supabase  
- **Email Service**: Nodemailer  
- **AI Integration**: Gemini 1.5 Flash API  

## 🚀 Setup & Deployment  
### Prerequisites  
- Node.js (v18+)  
- Supabase account (free tier works)  
- Google API key (for Gemini)  
- Email service (e.g., Gmail, SendGrid) for Nodemailer  

### Installation  
1. Clone the repo:  
   ```bash
   git clone https://github.com/saminyc/FiNews-AI.git
2. Install dependencies:
   npm install
3. Set up environment variables (rename .env.example to .env):

.env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
GEMINI_API_KEY=your_google_api_key
EMAIL_USER=your_nodemailer_email
EMAIL_PASS=your_nodemailer_password
Run the app:

4. bash
npm start
