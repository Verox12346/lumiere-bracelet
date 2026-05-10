# ✨ Lumiere Bracelet — Backend Setup Guide

## Stack
| Service | Purpose | Cost |
|---------|---------|------|
| **Render.com** | Host the Node.js API | Free |
| **Supabase** | PostgreSQL database | Free (500MB) |
| **Resend.com** | Send emails | Free (3,000/month) |
| **GitHub Pages** | Host your frontend | Free |

---

## STEP 1 — Set Up Supabase (Database)

1. Go to **https://supabase.com** → Sign up free
2. Click **New Project** → Name it `lumiere-bracelet`
3. Choose a strong password (save it!) → Select closest region → Create
4. Wait ~2 minutes for setup
5. Go to **SQL Editor** (left sidebar) → paste the contents of `supabase-schema.sql` → Run
6. Go to **Settings → API** and copy:
   - `Project URL` → this is your `SUPABASE_URL`
   - `service_role` key (under "Project API keys") → this is your `SUPABASE_SERVICE_KEY`

---

## STEP 2 — Set Up Resend (Emails)

1. Go to **https://resend.com** → Sign up free
2. Go to **API Keys** → Create a new key → Copy it (`RESEND_API_KEY`)
3. (Optional but recommended) Go to **Domains** → Add your domain for professional emails
   - Without a domain, you can use `onboarding@resend.dev` for testing

---

## STEP 3 — Push Backend to GitHub

```bash
# In your lumiere-backend folder:
git init
git add .
git commit -m "Initial backend setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/lumiere-bracelet-backend.git
git push -u origin main
```

---

## STEP 4 — Deploy to Render

1. Go to **https://render.com** → Sign up with GitHub
2. Click **New → Web Service**
3. Connect your `lumiere-bracelet-backend` repo
4. Configure:
   - **Name**: `lumiere-bracelet-api`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Click **Advanced → Add Environment Variables** and add all variables from `.env.example`:

```
SUPABASE_URL          = https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY  = your-service-role-key
RESEND_API_KEY        = re_your_key
OWNER_EMAIL           = braceletlumiere@gmail.com
WHATSAPP_NUMBER       = 212619079295
ADMIN_SECRET_KEY      = generate-a-random-string-here
FRONTEND_URL          = https://yourusername.github.io
```

6. Click **Deploy** — wait 3-5 minutes
7. Your API URL will be: `https://lumiere-bracelet-api.onrender.com`

---

## STEP 5 — Update Your Frontend

1. Open `frontend-script-updated.js` (rename to `script.js`)
2. Replace line 4 with your actual Render URL:
   ```js
   const API_URL = 'https://lumiere-bracelet-api.onrender.com';
   ```
3. Copy your image files into an `images/` folder
4. Push everything to GitHub

---

## STEP 6 — Deploy Frontend to GitHub Pages

1. In your frontend repo on GitHub:
   - Go to **Settings → Pages**
   - Source: **Deploy from branch → main → / (root)**
   - Save
2. Your site will be live at: `https://yourusername.github.io/lumiere-bracelet`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/` | Health check |
| `POST` | `/api/contact` | Submit contact form |
| `GET`  | `/api/contact` | List all messages (admin) |
| `POST` | `/api/orders` | Create order + get WhatsApp URL |
| `GET`  | `/api/orders` | List all orders (admin) |
| `PATCH`| `/api/orders/:id` | Update order status (admin) |

### Admin Access
Add header `x-admin-key: YOUR_ADMIN_SECRET_KEY` to protected endpoints.

---

## Testing Locally

```bash
npm install
cp .env.example .env   # Fill in your values
npm run dev
```

Test with curl:
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Hello!"}'
```

---

## ⚠️ Important Notes

- **Render free tier sleeps after 15 min of inactivity** — first request after sleep takes ~30s. Upgrade to $7/month Starter plan for always-on.
- **Never commit `.env`** — it's in `.gitignore` for a reason.
- Update `FRONTEND_URL` in Render env vars once your GitHub Pages URL is set.
