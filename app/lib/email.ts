import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendOTPEmail(email: string, otp: string) {
  await transporter.sendMail({
    from: `"Fitnest Admin" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your Fitnest Admin OTP',
    html: `
      <div style="background:#0a0a0a;padding:40px;font-family:Inter,sans-serif;max-width:480px;margin:0 auto;">
        <div style="background:#FF6B00;padding:3px 0;margin-bottom:32px;"></div>
        <h1 style="color:#fff;font-size:28px;margin:0 0 8px;letter-spacing:2px;">FITNEST</h1>
        <p style="color:rgba(255,255,255,0.4);font-size:12px;letter-spacing:4px;margin:0 0 40px;text-transform:uppercase;">Admin Panel Access</p>
        <p style="color:rgba(255,255,255,0.6);font-size:15px;margin:0 0 24px;">Your one-time login code:</p>
        <div style="background:#111;border:1px solid rgba(255,107,0,0.3);padding:24px;text-align:center;margin-bottom:24px;">
          <span style="color:#FF6B00;font-size:42px;font-weight:700;letter-spacing:12px;">${otp}</span>
        </div>
        <p style="color:rgba(255,255,255,0.3);font-size:13px;">This code expires in 10 minutes. Do not share it.</p>
        <div style="background:#FF6B00;padding:1px 0;margin-top:32px;"></div>
      </div>
    `,
  })
}