# Third-Party Service Setup Guide

This guide provides step-by-step instructions for configuring Google OAuth, SendGrid, and Twilio for your application.

## 1. Google OAuth (Google Sign-In)

Google OAuth allows users to log into your application using their Google accounts.

### Step-by-Step Configuration:
1. **Navigate to the Console:** Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. **Create a Project:** Click the project dropdown near the top-left and select **New Project**. Name it (e.g., "SarvaHub") and create it.
3. **Configure the Consent Screen:**
   - Go to **APIs & Services > OAuth consent screen**.
   - Select **External** (unless your app is restricted to a Google Workspace org).
   - Fill in the required fields: App Name, User Support Email, and Developer Contact Information.
   - You can skip Scopes and Test Users for now (or add basic `.../auth/userinfo.email` and `.../auth/userinfo.profile` scopes).
   - Click **Save and Continue** until complete.
4. **Create Credentials:**
   - Go to **APIs & Services > Credentials**.
   - Click **+ CREATE CREDENTIALS** at the top and select **OAuth client ID**.
   - Set the Application Type to **Web application**.
   - Name it (e.g., "NextJS Web Client").
   - Under **Authorized JavaScript origins**, add your local and production URLs:
     - `http://localhost:3000`
     - `https://your-production-domain.com`
   - Under **Authorized redirect URIs**, add the callback endpoints:
     - `http://localhost:3000/api/auth/callback/google` (if using NextAuth)
     - `http://localhost:5000/api/v1/auth/google/callback` (if your backend handles the callback directly)
   - Click **Create**.
5. **Update Environment Variables:** You will be given a Client ID and Client Secret. Add these to your backend and frontend `.env` files:
   ```env
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   ```

---

## 2. SendGrid (Email Delivery)

SendGrid handles transactional emails like password resets, onboarding confirmations, and order receipts.

### Step-by-Step Configuration:
1. **Create an Account:** Sign up at [SendGrid](https://signup.sendgrid.com/).
2. **Setup Sender Authentication:** Before you can send emails, SendGrid needs to verify you own the sending address.
   - Go to **Settings > Sender Authentication**.
   - **Option A (Quick): Single Sender Verification.** Verify a single email address (e.g., `noreply@yourdomain.com`) by clicking a link sent to your inbox. Note: This may land emails in Spam folders.
   - **Option B (Recommended): Domain Authentication.** Verify your entire domain (e.g., `sarvahub.com`). SendGrid will give you 3 CNAME records to add to your domain's DNS settings (GoDaddy, Route53, etc.). This ensures high deliverability.
3. **Generate an API Key:**
   - Go to **Settings > API Keys**.
   - Click **Create API Key**.
   - Name it (e.g., "SarvaHub Backend Key").
   - Select **Restricted Access** and give it "Full Access" ONLY to the **Mail Send** permission for security.
   - Click **Create & View** and **COPY THE KEY IMMEDIATELY** (it only shows once).
4. **Update Environment Variables:** Add the key and your verified sender email to your backend `.env` file:
   ```env
   SENDGRID_API_KEY=SG.your_long_api_key_here
   EMAIL_FROM=noreply@yourdomain.com
   ```

---

## 3. Twilio (SMS & OTP)

Twilio handles SMS delivery for phone verification (OTP) and notifications.

### Step-by-Step Configuration:
1. **Create an Account:** Sign up at the [Twilio Console](https://console.twilio.com/).
2. **Get a Phone Number:**
   - Navigate to **Phone Numbers > Manage > Buy a number**.
   - Purchase a number that has SMS capabilities enabled.
3. **Get API Credentials:**
   - On the main Twilio Console dashboard, scroll down to the **Account Info** section.
   - You will see your **Account SID** and **Auth Token** (click to reveal).
4. **Update Environment Variables:** Add these credentials to your backend `.env` file:
   ```env
   TWILIO_ACCOUNT_SID=AC...your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

> [!WARNING]
> **Important Note for Sending SMS to India (+91):**
> If you are sending SMS within India, telecom regulations (TRAI) require **DLT (Distributed Ledger Technology) Registration**. You cannot simply send text messages via Twilio to Indian numbers without:
> 1. Registering your business entity as a Principal Entity on a DLT portal (like Jio, Airtel, Vodafone).
> 2. Registering a Sender ID (e.g., `SRVHub`).
> 3. Registering your exact SMS message templates on the portal.
> 
> *Alternative:* If you only need this for OTPs, you can use **Twilio Verify API** which handles a lot of the localization and OTP generation automatically without you needing to explicitly format SMS messages via the standard Programmable SMS API.
