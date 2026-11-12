# Epson Expert Connect: Customer Website

The page customers open by scanning the QR code in a store. They enter their name, mobile, state and city, choose **video** or **voice** and a language, and are connected live to an Epson product expert.
**React + Vite**, hosted on **Vercel**. Talks to the **backend** (Render).

Related repositories: **backend** (API, Render + Neon) and **admin** (admin panel + expert console).

## Run locally

```bash
cp .env.example .env    # defaults are fine; the backend must be running on http://localhost:4000
npm install
npm run dev             # https://localhost:5173/?store=DEL-NP01
```

The dev server uses HTTPS (self-signed certificate) because browsers only allow camera and microphone on secure pages. Accept the certificate warning once.
To test on a phone on the same Wi-Fi, open `https://<your-computer-ip>:5173`.

## Deploy on Vercel

1. Push this repository to GitHub.
2. Vercel → **Add New… → Project** → import the repository (Framework: **Vite**, detected automatically; `vercel.json` handles page routing and headers).
3. **Environment Variables**:
   - `VITE_API_URL` = your Render backend URL, e.g. `https://epson-connect-api.onrender.com`
   - optional `VITE_HELPLINE_NUMBER`, `VITE_PRIVACY_POLICY_URL`
4. **Deploy**. Note the URL (e.g. `https://epson-connect.vercel.app`). It goes into the backend's `CORS_ORIGINS` and into the admin project's `VITE_WEBSITE_URL`.

`VITE_*` values are built into the app. After changing one, click **Redeploy** in Vercel.

## QR code links
Each store's QR code (generated in the admin panel under **Stores & QR**) opens:

```
https://<website>/?store=STORE_CODE&product=EcoTank%20L3250
```

`store` shows the store name and links leads to it; `product` (optional) names the printer on display.
