import { NextRequest, NextResponse } from 'next/server';
import { FormResponses } from '@/types';
import { calculateBlueprint } from '@/lib/scoring';
import {
  getMailTransporter,
  generateUserBlueprintEmail,
  generateAdminNotificationEmail,
} from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const responses: FormResponses = await req.json();

    if (!responses.firstName || !responses.email) {
      return NextResponse.json(
        { error: 'First name and email are required.' },
        { status: 400 }
      );
    }

    // 1. Calculate Blueprint & Score
    const blueprint = calculateBlueprint(responses);

    // 2. Prepare Emails
    const userEmailContent = generateUserBlueprintEmail(responses, blueprint);
    const adminEmailContent = generateAdminNotificationEmail(responses, blueprint);

    const transporter = getMailTransporter();
    const adminEmail = process.env.ADMIN_EMAIL || 'thedevvteam@gmail.com';
    const senderUser = process.env.SMTP_USER || 'thedevvteam@gmail.com';
    const senderName = process.env.NEXT_PUBLIC_SENDER_NAME || 'Safiyah from webly';

    let emailsDispatched = false;

    if (transporter) {
      try {
        // Dispatch to user
        await transporter.sendMail({
          from: `"${senderName}" <${senderUser}>`,
          to: responses.email,
          subject: 'Your MVP Scope Blueprint',
          text: userEmailContent.text,
          html: userEmailContent.html,
        });

        // Dispatch notification to admin (@thedevvteam@gmail.com)
        await transporter.sendMail({
          from: `"${senderName} Lead Engine" <${senderUser}>`,
          to: adminEmail,
          subject: adminEmailContent.subject,
          text: adminEmailContent.text,
          html: adminEmailContent.html,
        });

        emailsDispatched = true;
        console.log(`[Email] Successfully dispatched blueprint to ${responses.email} and lead alert to ${adminEmail}`);
      } catch (mailError) {
        console.error('[Email Error] Failed sending via Nodemailer:', mailError);
        // We log the error but still return the blueprint so user sees their results on screen
      }
    } else {
      console.warn(
        '[Email Notice] SMTP credentials are not configured yet in .env.local. (Blueprint was calculated and will be displayed on screen). To enable live delivery, set SMTP_USER and SMTP_PASS in .env.local.'
      );
    }

    return NextResponse.json({
      success: true,
      blueprint,
      emailsDispatched,
      message: emailsDispatched
        ? 'Your blueprint has been generated and sent to your email.'
        : 'Your blueprint has been generated successfully.',
    });
  } catch (error: any) {
    console.error('[Submit Route Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process assessment.' },
      { status: 500 }
    );
  }
}

