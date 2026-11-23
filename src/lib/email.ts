import nodemailer from 'nodemailer';
import { FormResponses, BlueprintResult } from '@/types';

// Create Nodemailer Transporter
export function getMailTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE !== 'false';
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';

  // If credentials are placeholders or empty, return null so we can mock/log gracefully
  if (!user || !pass || pass === 'your_gmail_app_password_here' || pass.includes('placeholder')) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

// 1. Generate HTML & Text for User's MVP Scope Blueprint Email
export function generateUserBlueprintEmail(responses: FormResponses, blueprint: BlueprintResult) {
  const senderName = process.env.NEXT_PUBLIC_SENDER_NAME || 'Safiyah from webly';
  const firstName = responses.firstName || 'there';

  const readinessLabel =
    blueprint.scoreBand === 'high' ? 'High (Ready to Define a Focused MVP)' :
    blueprint.scoreBand === 'medium' ? 'Medium (Promising, Needs Scope Narrowing)' :
    'Low (Needs Concept Clarity)';

  const buildFirstHtml = blueprint.buildFirstList
    .map((item) => `<li style="margin-bottom: 8px; color: #1f2937;"><strong>${item}</strong></li>`)
    .join('');

  const deferListHtml = blueprint.deferList
    .map((item) => `<li style="margin-bottom: 8px; color: #4b5563;"><span style="color: #b91c1c; font-weight: 600;">Leave out for now:</span> <strong>${item.feature}</strong> — ${item.reason}</li>`)
    .join('');

  const buildFirstText = blueprint.buildFirstList.map((i) => `• ${i}`).join('\n');
  const deferText = blueprint.deferList.map((i) => `• ${i.feature}: ${i.reason}`).join('\n');

  const text = `Hi ${firstName},

Based on your answers, here is the smallest version of your product to focus on first.

Your product idea:
${blueprint.productSummary}

Core workflow for version one:
${blueprint.coreWorkflowSummary}

Build first:
${buildFirstText}

Leave out for now:
${deferText}

Biggest risk:
${blueprint.biggestRisk}

MVP readiness: ${readinessLabel} (Score: ${blueprint.totalScore}/100)

If you want to turn this into a concrete two-week build plan, book a free 30-minute MVP scoping call:
${blueprint.calendlyUrl}

— ${senderName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your MVP Scope Blueprint</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #111827; background-color: #f9fafb; margin: 0; padding: 24px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    <!-- Header with gemstone orange banner -->
    <tr>
      <td style="padding: 32px 32px 24px; background: linear-gradient(135deg, #FF6B00 0%, #FFA800 40%, #E63900 100%); color: #ffffff;">
        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; color: rgba(255,255,255,0.9); display: block; margin-bottom: 8px;">MVP Scope Blueprint</span>
        <h1 style="font-size: 26px; font-weight: 800; margin: 0; letter-spacing: -0.5px; line-height: 1.2;">The Smallest Version to Build First</h1>
      </td>
    </tr>

    <!-- Body Content -->
    <tr>
      <td style="padding: 32px;">
        <p style="font-size: 16px; color: #374151; margin-top: 0;">Hi <strong>${firstName}</strong>,</p>
        <p style="font-size: 15px; color: #4b5563;">Based on your answers, here is the smallest, most focused version of your product to build in version one—and what to leave out for now.</p>

        <!-- Product Summary Box -->
        <div style="background-color: #fff7ed; border-left: 4px solid #f97316; padding: 16px; border-radius: 6px; margin: 24px 0;">
          <strong style="color: #9a3412; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Product Summary</strong>
          <p style="margin: 0; font-size: 15px; color: #7c2d12; line-height: 1.5;">${blueprint.productSummary}</p>
        </div>

        <!-- Core Workflow -->
        <div style="margin: 24px 0;">
          <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; margin-bottom: 8px;">Core Workflow for Version One</h3>
          <p style="font-size: 15px; background: #f3f4f6; padding: 14px 16px; border-radius: 8px; margin: 0; color: #1f2937;">${blueprint.coreWorkflowSummary}</p>
        </div>

        <!-- Build First -->
        <div style="margin: 28px 0;">
          <h3 style="font-size: 15px; font-weight: 700; color: #047857; margin-bottom: 12px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 8px; height: 8px; background: #10b981; border-radius: 50%; margin-right: 8px;"></span>
            Build First (Version One Core)
          </h3>
          <ul style="padding-left: 20px; margin: 0;">
            ${buildFirstHtml}
          </ul>
        </div>

        <!-- Leave Out For Now -->
        <div style="margin: 28px 0;">
          <h3 style="font-size: 15px; font-weight: 700; color: #b91c1c; margin-bottom: 12px;">
            <span style="display: inline-block; width: 8px; height: 8px; background: #ef4444; border-radius: 50%; margin-right: 8px;"></span>
            Leave Out For Now (Defer)
          </h3>
          <ul style="padding-left: 20px; margin: 0;">
            ${deferListHtml}
          </ul>
        </div>

        <!-- Biggest Risk -->
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 16px; border-radius: 8px; margin: 24px 0;">
          <strong style="color: #991b1b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Your Biggest Risk</strong>
          <p style="margin: 0; font-size: 14px; color: #7f1d1d;">${blueprint.biggestRisk}</p>
        </div>

        <!-- Readiness Badge -->
        <div style="margin: 24px 0; padding: 16px; background-color: #f8fafc; border-radius: 8px; text-align: center;">
          <span style="font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 600; display: block;">MVP Readiness Score</span>
          <span style="font-size: 28px; font-weight: 800; color: #0f172a;">${blueprint.totalScore} <span style="font-size: 16px; color: #64748b;">/ 100</span></span>
          <span style="display: block; font-size: 13px; font-weight: 600; color: #f97316; margin-top: 4px;">${readinessLabel}</span>
        </div>

        <!-- CTA Call to Action -->
        <div style="margin: 32px 0 16px; text-align: center;">
          <p style="font-size: 15px; color: #374151; margin-bottom: 16px;">If you want to turn this into a concrete two-week build plan, book a free 30-minute MVP scoping call:</p>
          <a href="${blueprint.calendlyUrl}" style="display: inline-block; background: linear-gradient(135deg, #FF6B00 0%, #E63900 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; font-weight: 700; font-size: 15px; border-radius: 8px; box-shadow: 0 4px 12px rgba(230, 57, 0, 0.35);">
            ${blueprint.ctaText} →
          </a>
        </div>

        <p style="font-size: 14px; color: #6b7280; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
          — <strong>${senderName}</strong>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { text, html };
}

// 2. Generate Notification Email for the Team (@thedevvteam@gmail.com)
export function generateAdminNotificationEmail(responses: FormResponses, blueprint: BlueprintResult) {
  const isHigh = blueprint.isHighFit || blueprint.totalScore >= 70;
  const statusBadge = isHigh
    ? '🔥 HIGH FIT LEAD — Ready to Work Together!'
    : blueprint.scoreBand === 'medium'
    ? '⚡ MEDIUM FIT — Promising Lead'
    : 'ℹ️ LOW CLARITY — Early Stage Explorer';

  const subject = isHigh
    ? `🔥 HOT LEAD [Score: ${blueprint.totalScore}/100 - Ready to Work]: ${responses.firstName} (${responses.email})`
    : `New Lead [Score: ${blueprint.totalScore}/100 - ${blueprint.scoreBand.toUpperCase()}]: ${responses.firstName}`;

  const text = `================================================
${statusBadge}
================================================

LEAD CONTACT DETAILS:
- Name: ${responses.firstName}
- Email: ${responses.email}
- Phone: ${responses.phone || 'Not provided'}
- Date: ${new Date().toLocaleString()}

SCORE & READINESS:
- Total Score: ${blueprint.totalScore} / 100
- Band: ${blueprint.scoreBand.toUpperCase()} (${blueprint.bandTitle})
- Recommendation: ${blueprint.bandMessage}
- High-Fit Flag: ${isHigh ? 'YES - PRIORITIZE OUTREACH' : 'No'}

GENERATED BLUEPRINT:
- Product Summary: ${blueprint.productSummary}
- Core Workflow: ${blueprint.coreWorkflowSummary}
- Biggest Risk: ${blueprint.biggestRisk}

FULL FORM RESPONSES:
Q1. Product Type: ${responses.q1_productType}
Q2. Idea Stage: ${responses.q2_stage}
Q3. First Target Customer: ${responses.q3_targetCustomer}
Q4. Problem Solved: ${responses.q4_problem}
Q5. Current Workarounds: ${responses.q5_currentSolution.join(', ')}
Q6. Main Outcome: ${responses.q6_mainOutcome}
Q7. User Journey: ${responses.q7_userJourney}
Q8. Wishlist Features: ${responses.q8_features.join(', ')}
Q9. Launch Timeline: ${responses.q9_timeline}
Q10. Investment Willingness: ${responses.q10_investment}
`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; color: #111827; background-color: #f3f4f6; padding: 20px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden;">
    <!-- Lead Qualification Header -->
    <tr>
      <td style="padding: 24px; background: ${isHigh ? '#064e3b' : '#1f2937'}; color: #ffffff;">
        <span style="display: inline-block; padding: 4px 12px; background: ${isHigh ? '#10b981' : '#f97316'}; color: #ffffff; font-weight: 800; font-size: 12px; text-transform: uppercase; border-radius: 9999px; margin-bottom: 12px;">
          ${isHigh ? '🔥 HOT QUALIFIED LEAD' : 'NEW FORM SUBMISSION'}
        </span>
        <h2 style="margin: 0; font-size: 22px;">${responses.firstName} — Score: ${blueprint.totalScore}/100 (${blueprint.scoreBand.toUpperCase()})</h2>
        <p style="margin: 6px 0 0; color: ${isHigh ? '#a7f3d0' : '#9ca3af'}; font-size: 14px;">
          ${isHigh ? 'High readiness score detected. Serious interest in building their MVP.' : blueprint.bandTitle}
        </p>
      </td>
    </tr>

    <!-- Contact Info Cards -->
    <tr>
      <td style="padding: 24px;">
        <h3 style="font-size: 14px; text-transform: uppercase; color: #6b7280; letter-spacing: 1px; margin-top: 0;">Contact Details</h3>
        <table width="100%" style="border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; width: 140px; color: #4b5563;">First Name:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-weight: 700;">${responses.firstName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #4b5563;">Email Address:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;"><a href="mailto:${responses.email}" style="color: #ea580c; font-weight: 600;">${responses.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #4b5563;">Phone Number:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${responses.phone || '<em style="color:#9ca3af">Not provided</em>'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #4b5563;">Investment Willingness:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-weight: 700; color: ${responses.q10_investment.includes('ready to invest') ? '#059669' : '#111827'};">
              ${responses.q10_investment}
            </td>
          </tr>
        </table>

        <!-- Blueprint Snapshot -->
        <h3 style="font-size: 14px; text-transform: uppercase; color: #6b7280; letter-spacing: 1px;">Generated Scope Snapshot</h3>
        <div style="background: #fff7ed; border-left: 4px solid #ea580c; padding: 14px; border-radius: 6px; margin-bottom: 16px;">
          <strong style="color: #9a3412; font-size: 12px; text-transform: uppercase;">Product Summary</strong>
          <p style="margin: 4px 0 0; font-size: 14px; color: #7c2d12;">${blueprint.productSummary}</p>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 6px; margin-bottom: 24px;">
          <strong style="color: #475569; font-size: 12px; text-transform: uppercase;">Core Workflow (V1)</strong>
          <p style="margin: 4px 0 0; font-size: 14px; color: #1e293b;">${blueprint.coreWorkflowSummary}</p>
        </div>

        <!-- Detailed Responses -->
        <h3 style="font-size: 14px; text-transform: uppercase; color: #6b7280; letter-spacing: 1px;">Full Form Responses</h3>
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; font-size: 13px;">
          <p><strong>1. Product Type:</strong> ${responses.q1_productType}</p>
          <p><strong>2. Idea Stage:</strong> ${responses.q2_stage}</p>
          <p><strong>3. Target Customer:</strong> ${responses.q3_targetCustomer}</p>
          <p><strong>4. Problem Solved:</strong> ${responses.q4_problem}</p>
          <p><strong>5. Current Workarounds:</strong> ${(responses.q5_currentSolution || []).join(', ')}</p>
          <p><strong>6. Main Outcome:</strong> ${responses.q6_mainOutcome}</p>
          <p><strong>7. User Journey:</strong> ${responses.q7_userJourney}</p>
          <p><strong>8. Wishlist Features:</strong> ${(responses.q8_features || []).join(', ')}</p>
          <p><strong>9. Launch Timeline:</strong> ${responses.q9_timeline}</p>
          <p><strong>10. Investment:</strong> ${responses.q10_investment}</p>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}

