# MVP Scope Blueprint — Lead Magnet & Scoping Engine

A high-converting, premium multi-step qualification lead magnet application built with **Next.js 14**, **Tailwind CSS**, and **Framer Motion**.

Inspired by **Lara Acosta's** high-authority editorial typography & Typeform-smooth form flow, combined with the **luxury gemstone amber/orange glow & glassmorphism aesthetic** of modern high-end digital studios.

---

## 🌟 What This System Does

1. **Editorial Hero Section**:
   * Uses high-contrast editorial serif typography (`Playfair Display`) paired with crisp modern sans-serif (`Plus Jakarta Sans`) and amber gemstone glow effects.
   * High-converting headline structure modeled after Lara Acosta's lead-gen asset.
2. **Smooth 10-Question Qualification Engine**:
   * One question per screen with dynamic progress bar and question numbering badges (`01` to `10`).
   * Keyboard shortcuts (`A`, `B`, `C`, `D`, `Enter`, `Backspace`) for a buttery-smooth Typeform feel.
   * Tests product type, validation stage, target niche, core friction, workarounds, primary outcome, version one journey, feature scope, urgency, and investment willingness.
3. **Contact Details Screen**:
   * Captures First Name, Email (Required), and Phone Number (Optional for WhatsApp follow-up).
4. **Instant On-Screen MVP Scope Blueprint**:
   * **Score Gauge & Readiness Band**:
     * **0–39 (Low)**: Idea Needs Clarity → CTA: *"Get feedback on how to clarify your MVP"*
     * **40–69 (Medium)**: Promising, But Scope Needs Narrowing → CTA: *"Discuss how to narrow your MVP to two weeks"*
     * **70–100 (High)**: Ready to Define a Focused MVP → CTA: *"Turn this into a two-week build plan"*
   * **Hot Lead Alert Banner**: Signals leads ready for a fast 2-week MVP build.
   * **Dynamic Product Summary**: Formulates an exact one-sentence product vision based on their answers.
   * **Build First (V1 Core Essentials)**: Dynamic list customized to their primary outcome.
   * **Leave Out For Now (Defer)**: Automatically diagnoses features on their wishlist (AI, mobile app, custom billing, admin panels) that delay launch, with clear rationale.
   * **Biggest Risk Diagnosis**: Pinpoints their primary strategic bottleneck.
   * **Direct Calendly Integration**: Custom CTA links directly to `https://calendly.com/safiyahamedu/book-a-1-1-call-with-safiyah-amedu`.
5. **Dual Email Notification with Nodemailer**:
   * **User Email**: Sends the full customized Scope Blueprint to their inbox immediately.
   * **Admin Lead Notification**: Dispatches an instant dossier to `thedevvteam@gmail.com` with full answers, contact details, score, and a **`🔥 HOT LEAD`** alert for high scores.

---

## 🚀 Quick Setup & Configuration

### 1. Configure Email Credentials in `.env.local`

Open `.env.local` in the project root:

```env
# Nodemailer / Gmail SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=thedevvteam@gmail.com
SMTP_PASS=your_gmail_app_password_here

# Recipient for high-score lead alerts
ADMIN_EMAIL=thedevvteam@gmail.com

# Booking & Brand Config
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/safiyahamedu/book-a-1-1-call-with-safiyah-amedu
NEXT_PUBLIC_SENDER_NAME="Safiyah from webly"
```

> **How to get a Gmail App Password:**
> 1. Go to your Google Account: [https://myaccount.google.com/security](https://myaccount.google.com/security)
> 2. Ensure **2-Step Verification** is ON.
> 3. Go to **App passwords**: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
> 4. Create an App Password called `MVP Blueprint` and paste the 16-character code into `SMTP_PASS`.

### 2. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Deploy to Vercel

Push the repository to GitHub and import it into Vercel. Add the environment variables from `.env.local` to Vercel's Project Settings.

