import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.hostinger.com';
const SMTP_PORT = Number(process.env.SMTP_PORT || '465');
const SMTP_USER = process.env.SMTP_USER || 'info@dharafoundations.com';
const SMTP_PASS = process.env.SMTP_PASS || 'Dharafoundations@123';
const SMTP_FROM = process.env.SMTP_FROM || '"Dhara Foundations" <info@dharafoundations.com>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@dharafoundations.com';

let transporter: any = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!SMTP_USER || !SMTP_PASS) {
    console.warn("SMTP credentials missing. Email dispatches will run in mock simulation mode.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for port 465 SSL/TLS
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  return transporter;
}

export async function sendMail(to: string, subject: string, html: string): Promise<boolean> {
  const client = getTransporter();

  if (!client) {
    console.log(`[Email Simulation] To: ${to} | Subject: ${subject}`);
    return true;
  }

  try {
    const info = await client.sendMail({
      from: SMTP_FROM,
      to,
      subject,
      html,
    });
    console.log(`[Email Sent] MessageId: ${info.messageId} | To: ${to}`);
    return true;
  } catch (error) {
    console.error("Email dispatch failed:", error);
    return false;
  }
}

/**
 * Generates styled HTML layout for emails
 */
function buildEmailTemplate(title: string, contentHtml: string, isUserConfirmation: boolean = true): string {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 30px 10px;">
      <tr>
        <td align="center">
          <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #401C0C 0%, #7c2d12 100%); padding: 30px 24px; text-align: center;">
                <h1 style="margin: 0; color: #fef3c7; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">DHARA FOUNDATIONS</h1>
                <p style="margin: 6px 0 0 0; color: #fde68a; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Dhara Divine Awards & Seva Initiatives</p>
              </td>
            </tr>
            <!-- Content -->
            <tr>
              <td style="padding: 32px 28px;">
                <h2 style="margin: 0 0 20px 0; color: #401C0C; font-size: 20px; font-weight: 600; border-bottom: 2px solid #fef3c7; padding-bottom: 10px;">
                  ${title}
                </h2>
                ${contentHtml}
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background-color: #f1f5f9; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0; font-size: 13px; color: #64748b;">
                  <strong>Dhara Foundations</strong> &bull; Serving Humanity with Devotion
                </p>
                <p style="margin: 6px 0 0 0; font-size: 12px; color: #94a3b8;">
                  Email: <a href="mailto:info@dharafoundations.com" style="color: #d97706; text-decoration: none;">info@dharafoundations.com</a> | Web: <a href="https://dharafoundations.com" style="color: #d97706; text-decoration: none;">dharafoundations.com</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

/**
 * Dispatches confirmation emails to users & notification emails to admin
 */
export async function dispatchEmails(module: string, userEmail: string, userPayload: any) {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // 1. Send Confirmation Email to User
  if (userEmail && userEmail.trim()) {
    let userSubject = `Confirmation: Your Submission for ${module} - Dhara Foundations`;
    let userBody = `<p style="font-size: 15px; line-height: 1.6; color: #334155;">Namaste <strong>${userPayload.name || userPayload.sender_name || userPayload.nominator_name || userPayload.delegate_name || 'Valued Supporter'}</strong>,</p>`;

    if (module === 'General Enquiries') {
      userSubject = `Thank You for Contacting Dhara Foundations`;
      userBody += `
        <p style="font-size: 15px; line-height: 1.6; color: #334155;">Thank you for reaching out to us. We have received your message regarding <strong>"${userPayload.subject || 'General Inquiry'}"</strong>.</p>
        <div style="background-color: #fffbebf8; border-left: 4px solid #d97706; padding: 16px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0 0 8px 0; font-weight: 600; color: #78350f;">Your Submitted Message:</p>
          <p style="margin: 0; font-style: italic; color: #451a03;">"${userPayload.message || ''}"</p>
        </div>
        <p style="font-size: 15px; line-height: 1.6; color: #334155;">Our team will review your inquiry and get back to you shortly.</p>
      `;
    } else if (module === 'Award Nominations') {
      userSubject = `Nomination Received: ${userPayload.nominee_name || 'Dhara Divine Awards'}`;
      userBody += `
        <p style="font-size: 15px; line-height: 1.6; color: #334155;">Thank you for submitting a nomination for the Dhara Divine Awards.</p>
        <ul style="line-height: 1.8; color: #334155;">
          <li><strong>Nominee Name:</strong> ${userPayload.nominee_name || 'N/A'}</li>
          <li><strong>Category:</strong> ${userPayload.category || 'N/A'}</li>
          <li><strong>Nominator:</strong> ${userPayload.nominator_name || 'Anonymous'}</li>
          <li><strong>Vetting Status:</strong> Pending Review</li>
        </ul>
        <p style="font-size: 15px; line-height: 1.6; color: #334155;">Our jury committee will evaluate the nomination and contact you if further information is required.</p>
      `;
    } else if (module === 'Event Registration') {
      userSubject = `Event Registration Pass: ${userPayload.pass_code || 'Dhara Divine Awards'}`;
      userBody += `
        <p style="font-size: 15px; line-height: 1.6; color: #334155;">Your registration for the Dhara Divine Awards event has been successfully confirmed!</p>
        <div style="background-color: #f0fdf4; border: 1px dashed #16a34a; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 12px; text-transform: uppercase; color: #15803d; font-weight: bold; letter-spacing: 1px;">Your Entry Pass Code</p>
          <p style="margin: 8px 0; font-size: 28px; font-weight: 800; color: #166534; font-family: monospace;">${userPayload.pass_code || 'DDA-2026'}</p>
          <p style="margin: 0; font-size: 13px; color: #166534;">Pass Tier: <strong>${(userPayload.pass_tier || 'Delegate').toUpperCase()}</strong> | Zone: <strong>${userPayload.seat_zone || 'General'}</strong></p>
        </div>
        <p style="font-size: 14px; color: #475569;">Please present this Pass Code at the registration desk on the event day for seamless gate entry.</p>
      `;
    } else if (module === 'Volunteer Registration') {
      userSubject = `Welcome to Dhara Foundations Volunteer Team`;
      userBody += `
        <p style="font-size: 15px; line-height: 1.6; color: #334155;">Thank you for stepping forward to serve as a volunteer for Dhara Foundations.</p>
        <p style="font-size: 15px; line-height: 1.6; color: #334155;">We have logged your application and skills. Our volunteer coordinator will reach out with task schedules and orientation details.</p>
      `;
    } else if (['Donor Support', 'Sponsorship', 'Corporate CSR'].includes(module)) {
      userSubject = `Receipt & Acknowledgement: Contribution to Dhara Foundations`;
      userBody += `
        <p style="font-size: 15px; line-height: 1.6; color: #334155;">Thank you for your generous contribution of <strong>₹${Number(userPayload.amount || 0).toLocaleString('en-IN')}</strong> for <strong>${userPayload.seva_domain || 'General Seva Fund'}</strong>.</p>
        <p style="font-size: 15px; line-height: 1.6; color: #334155;">Your support enables us to continue our noble mission and empower communities. Your official 80G tax exemption receipt will be issued to your email.</p>
      `;
    } else {
      userBody += `<p style="font-size: 15px; line-height: 1.6; color: #334155;">We have received your submission for <strong>${module}</strong> and recorded it in our system.</p>`;
    }

    userBody += `<p style="font-size: 14px; margin-top: 24px; color: #64748b;">With warm regards,<br><strong>Dhara Foundations Team</strong></p>`;

    const htmlTemplate = buildEmailTemplate(`Submission Received: ${module}`, userBody, true);
    await sendMail(userEmail.trim(), userSubject, htmlTemplate);
  }

  // 2. Send Contact / Notification Email to Admin (ADMIN_EMAIL)
  if (ADMIN_EMAIL && ADMIN_EMAIL.trim()) {
    const adminSubject = `[ALERT] New Submission Received: ${module}`;
    
    let detailsRows = `
      <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; width: 140px; color: #475569;">Module:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${module}</td></tr>
      <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Received At:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${timestamp}</td></tr>
    `;

    for (const [key, value] of Object.entries(userPayload)) {
      if (['id', 'proof_image', 'avatar_url', 'nominee_work_image'].includes(key)) continue;
      const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const valStr = typeof value === 'object' ? JSON.stringify(value) : String(value || 'N/A');
      detailsRows += `<tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">${formattedKey}:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${valStr}</td></tr>`;
    }

    const adminBody = `
      <p style="font-size: 15px; color: #334155;">A new form submission / contact message has been submitted on the Dhara Divine Awards website:</p>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 20px 0; border-collapse: collapse; background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px;">
        ${detailsRows}
      </table>
      <p style="font-size: 13px; color: #64748b;">Log into your admin dashboard to review and manage this record.</p>
    `;

    const adminHtmlTemplate = buildEmailTemplate(`New Submission Alert [${module}]`, adminBody, false);
    await sendMail(ADMIN_EMAIL.trim(), adminSubject, adminHtmlTemplate);
  }
}
