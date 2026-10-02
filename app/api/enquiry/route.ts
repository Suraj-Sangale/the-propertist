import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Helper to sanitize inputs and prevent HTML injection in emails
function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      propertyTitle,
      propertyLocality,
      propertyPrice,
      propertySlug,
      message,
    } = body;

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please enter a valid full name." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== "string" || phone.trim().replace(/\D/g, "").length < 8) {
      return NextResponse.json(
        { error: "Please enter a valid phone number (at least 8-10 digits)." },
        { status: 400 }
      );
    }

    const safeName = escapeHtml(name.trim());
    const safeEmail = escapeHtml(email.trim());
    const safePhone = escapeHtml(phone.trim());
    const safePropertyTitle = escapeHtml(propertyTitle || "Featured Luxury Property");
    const safeLocality = escapeHtml(propertyLocality || "Mumbai");
    const safePrice = escapeHtml(propertyPrice || "Price on Request");
    const safeSlug = escapeHtml(propertySlug || "");
    const safeMessage = escapeHtml(message || "");

    const timestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });

    // Email Credentials from .env
    const mailUser = process.env.MAIL_USER || "surajdsangale@gmail.com";
    const rawPass = process.env.MAIL_PASS || process.env.MY_EMAIL_APP_PASSWORD || "";
    // Remove spaces from Gmail app passwords if any
    const mailPass = rawPass.replace(/\s+/g, "");

    if (!mailPass) {
      console.error("Email configuration error: MAIL_PASS or MY_EMAIL_APP_PASSWORD missing in env.");
      return NextResponse.json(
        { error: "Email service is temporarily unavailable. Please try calling directly." },
        { status: 500 }
      );
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: mailUser,
        pass: mailPass,
      },
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5000";
    const propertyUrl = safeSlug ? `${siteUrl}/property/${safeSlug}` : siteUrl;

    // ─── TEMPLATE 1: Admin Alert Email (To Owner / Admin) ────────────────────
    const adminHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Property Lead</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0a0e1e 0%, #161f38 100%); padding: 32px 30px; text-align: left; border-bottom: 3px solid #c8a84b;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="display: inline-block; background: rgba(200, 168, 75, 0.2); color: #ebd9a2; border: 1px solid rgba(200, 168, 75, 0.4); font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; margin-bottom: 12px;">
                      ⚡ NEW VIP LEAD ALERT
                    </span>
                    <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">
                      Property Enquiry Received
                    </h1>
                    <p style="color: #94a3b8; font-size: 13px; margin: 6px 0 0 0;">
                      The Propertist Lead Routing System • ${timestamp} IST
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Lead Details Body -->
          <tr>
            <td style="padding: 30px;">
              
              <!-- Property Box -->
              <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 20px; margin-bottom: 24px;">
                <span style="font-size: 11px; font-weight: 800; color: #b8963c; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 6px;">
                  INQUIRED PROPERTY
                </span>
                <h2 style="font-size: 20px; font-weight: 800; color: #0a0e1e; margin: 0 0 6px 0;">
                  ${safePropertyTitle}
                </h2>
                <p style="font-size: 14px; color: #64748b; margin: 0 0 14px 0;">
                  📍 ${safeLocality}, Mumbai • <strong style="color: #0a0e1e;">${safePrice}</strong>
                </p>
                <a href="${propertyUrl}" target="_blank" style="display: inline-block; background: #0a0e1e; color: #ebd9a2; text-decoration: none; font-size: 12px; font-weight: 700; padding: 8px 16px; border-radius: 8px;">
                  Open Property Page →
                </a>
              </div>

              <!-- Prospect Contact Card -->
              <h3 style="font-size: 15px; font-weight: 800; color: #0a0e1e; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 14px 0; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">
                Prospective Buyer Details
              </h3>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td width="35%" style="padding: 10px 0; font-size: 13px; color: #64748b; font-weight: 600;">Full Name:</td>
                  <td width="65%" style="padding: 10px 0; font-size: 14px; color: #0a0e1e; font-weight: 700;">${safeName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 13px; color: #64748b; font-weight: 600; border-top: 1px solid #f1f5f9;">Phone Number:</td>
                  <td style="padding: 10px 0; font-size: 15px; color: #0a0e1e; font-weight: 800; border-top: 1px solid #f1f5f9;">
                    <a href="tel:${safePhone}" style="color: #b8963c; text-decoration: none;">${safePhone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 13px; color: #64748b; font-weight: 600; border-top: 1px solid #f1f5f9;">Email Address:</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #0a0e1e; font-weight: 600; border-top: 1px solid #f1f5f9;">
                    <a href="mailto:${safeEmail}" style="color: #2563eb; text-decoration: none;">${safeEmail}</a>
                  </td>
                </tr>
                ${
                  safeMessage
                    ? `<tr>
                  <td style="padding: 10px 0; font-size: 13px; color: #64748b; font-weight: 600; border-top: 1px solid #f1f5f9;">Message / Notes:</td>
                  <td style="padding: 10px 0; font-size: 13px; color: #334155; line-height: 1.5; border-top: 1px solid #f1f5f9;">${safeMessage}</td>
                </tr>`
                    : ""
                }
              </table>

              <!-- Action Buttons -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 10px;">
                <tr>
                  <td align="center">
                    <a href="tel:${safePhone}" style="display: inline-block; background: #c8a84b; color: #0a0e1e; text-decoration: none; font-size: 14px; font-weight: 800; padding: 12px 24px; border-radius: 10px; margin-right: 10px; box-shadow: 0 4px 12px rgba(200, 168, 75, 0.3);">
                      📞 Call ${safeName}
                    </a>
                    <a href="mailto:${safeEmail}?subject=Regarding your enquiry for ${encodeURIComponent(safePropertyTitle)}" style="display: inline-block; background: #0a0e1e; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 12px 24px; border-radius: 10px;">
                      ✉️ Reply Email
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
              This notification was generated automatically by <strong>The Propertist</strong> web platform.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // ─── TEMPLATE 2: Client Thank-You & Confirmation Email (To User) ─────────
    const clientHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Your Property Enquiry Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 35px 15px;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 40px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Top Luxury Accent Line -->
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, #b8963c 0%, #c8a84b 50%, #ebd9a2 100%);"></td>
          </tr>

          <!-- Brand Header -->
          <tr>
            <td style="background-color: #0a0e1e; padding: 36px 32px 30px; text-align: center;">
              <div style="display: inline-block; background: rgba(200, 168, 75, 0.15); border: 1px solid rgba(200, 168, 75, 0.3); border-radius: 12px; padding: 8px 18px; margin-bottom: 12px;">
                <span style="color: #c8a84b; font-size: 13px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase;">
                  THE PROPERTIST
                </span>
              </div>
              <h1 style="color: #ffffff; font-size: 23px; font-weight: 800; margin: 0; letter-spacing: -0.3px;">
                Thank You for Your Enquiry
              </h1>
              <p style="color: #94a3b8; font-size: 13px; margin: 8px 0 0 0; letter-spacing: 0.5px;">
                Curated Luxury Living • Mumbai Metropolitan Region
              </p>
            </td>
          </tr>

          <!-- Main Client Content -->
          <tr>
            <td style="padding: 36px 32px;">
              <p style="font-size: 16px; font-weight: 700; color: #0a0e1e; margin: 0 0 14px 0;">
                Dear ${safeName},
              </p>
              <p style="font-size: 14.5px; line-height: 1.65; color: #475569; margin: 0 0 24px 0;">
                We are delighted to confirm that your enquiry for <strong>${safePropertyTitle}</strong> has been received by our senior client advisory desk. A dedicated luxury property consultant has been assigned to provide you with exclusive developer pricing, verified floor plans, and priority access.
              </p>

              <!-- Inquired Property Summary Box -->
              <div style="background: linear-gradient(135deg, #0a0e1e 0%, #161f38 100%); border-radius: 16px; padding: 24px; color: #ffffff; margin-bottom: 28px; border: 1px solid rgba(200, 168, 75, 0.3); box-shadow: 0 10px 25px rgba(10, 14, 30, 0.2);">
                <span style="font-size: 10.5px; font-weight: 800; color: #c8a84b; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 6px;">
                  RESERVED PROPERTY OVERVIEW
                </span>
                <h2 style="font-size: 22px; font-weight: 800; color: #ffffff; margin: 0 0 8px 0;">
                  ${safePropertyTitle}
                </h2>
                <p style="font-size: 14px; color: #cbd5e1; margin: 0 0 16px 0;">
                  📍 ${safeLocality}, Mumbai • Starting from <strong style="color: #c8a84b;">${safePrice}</strong>
                </p>
                <div style="display: inline-block; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; padding: 6px 12px; font-size: 11.5px; color: #ebd9a2; font-weight: 700;">
                  ✓ Verified Project • Zero Brokerage Assistance
                </div>
              </div>

              <!-- Next Steps List -->
              <h3 style="font-size: 14px; font-weight: 800; color: #0a0e1e; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 16px 0;">
                What to Expect Next
              </h3>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                <tr>
                  <td width="36" valign="top" style="padding-bottom: 16px;">
                    <div style="width: 28px; height: 28px; border-radius: 50%; background: rgba(200, 168, 75, 0.15); color: #b8963c; font-weight: 800; font-size: 12px; text-align: center; line-height: 28px;">1</div>
                  </td>
                  <td valign="top" style="padding-bottom: 16px; padding-left: 10px;">
                    <strong style="color: #0a0e1e; font-size: 13.5px; display: block; margin-bottom: 2px;">Advisory Callback</strong>
                    <span style="color: #64748b; font-size: 13px; line-height: 1.5;">Our consultant will contact you at <strong>${safePhone}</strong> to review your timeline and preferred configuration.</span>
                  </td>
                </tr>
                <tr>
                  <td width="36" valign="top" style="padding-bottom: 16px;">
                    <div style="width: 28px; height: 28px; border-radius: 50%; background: rgba(200, 168, 75, 0.15); color: #b8963c; font-weight: 800; font-size: 12px; text-align: center; line-height: 28px;">2</div>
                  </td>
                  <td valign="top" style="padding-bottom: 16px; padding-left: 10px;">
                    <strong style="color: #0a0e1e; font-size: 13.5px; display: block; margin-bottom: 2px;">Comprehensive Brochure & Price Sheet</strong>
                    <span style="color: #64748b; font-size: 13px; line-height: 1.5;">You will receive the complete unit master plan, payment schedules, and limited-period developer benefits.</span>
                  </td>
                </tr>
                <tr>
                  <td width="36" valign="top">
                    <div style="width: 28px; height: 28px; border-radius: 50%; background: rgba(200, 168, 75, 0.15); color: #b8963c; font-weight: 800; font-size: 12px; text-align: center; line-height: 28px;">3</div>
                  </td>
                  <td valign="top" style="padding-left: 10px;">
                    <strong style="color: #0a0e1e; font-size: 13.5px; display: block; margin-bottom: 2px;">Private Site Experience</strong>
                    <span style="color: #64748b; font-size: 13px; line-height: 1.5;">We coordinate dedicated show apartment walkthroughs at your convenience with our compliments.</span>
                  </td>
                </tr>
              </table>

              <!-- Call to Action -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 14px; padding: 18px; text-align: center;">
                <tr>
                  <td>
                    <p style="font-size: 13px; color: #475569; margin: 0 0 10px 0; font-weight: 600;">
                      Need immediate assistance or wish to speak to an advisor right away?
                    </p>
                    <a href="tel:+917039529129" style="display: inline-block; background: #c8a84b; color: #0a0e1e; text-decoration: none; font-size: 13.5px; font-weight: 800; padding: 10px 22px; border-radius: 999px; margin-right: 8px;">
                      📞 Speak with Specialist: +91 70395 29129
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 14px; color: #475569; margin: 28px 0 0 0; line-height: 1.6;">
                Warm regards,<br>
                <strong style="color: #0a0e1e;">Private Client Desk</strong><br>
                <span style="color: #94a3b8; font-size: 12.5px;">The Propertist • Luxury Real Estate Advisory</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0a0e1e; padding: 24px 32px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); font-size: 11.5px; color: #64748b;">
              © 2026 The Propertist. All rights reserved.<br>
              Mumbai Metropolitan Region, Maharashtra, India.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Send both emails in parallel using Promise.allSettled
    const [adminResult, clientResult] = await Promise.allSettled([
      // 1. Send Email to Admin
      transporter.sendMail({
        from: `"The Propertist Leads" <${mailUser}>`,
        to: mailUser,
        replyTo: safeEmail,
        subject: `🔔 New VIP Lead: ${safePropertyTitle} - ${safeName} (${safePhone})`,
        html: adminHtml,
      }),
      // 2. Send Confirmation Email to Client
      transporter.sendMail({
        from: `"The Propertist Concierge" <${mailUser}>`,
        to: email.trim(),
        subject: `Exclusive Details: ${safePropertyTitle} | The Propertist Concierge`,
        html: clientHtml,
      }),
    ]);

    if (adminResult.status === "rejected") {
      console.error("Failed to send admin email:", adminResult.reason);
    }
    if (clientResult.status === "rejected") {
      console.error("Failed to send client confirmation email:", clientResult.reason);
    }

    // If both failed, return error to user
    if (adminResult.status === "rejected" && clientResult.status === "rejected") {
      return NextResponse.json(
        { error: "Could not send enquiry email at this moment. Please call us directly." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Enquiry sent successfully! Our specialist will contact you shortly.",
    });
  } catch (error: any) {
    console.error("Enquiry API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
