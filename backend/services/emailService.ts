import nodemailer from "nodemailer";
import "dotenv/config";

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.GMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }

  async sendVerificationEmail(
    email: string,
    verificationToken: string,
    firstName: string
  ) {
    const verificationUrl = `${process.env.APP_URL}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Verify Your StudyBuddy Account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">StudyBuddy</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Email Verification</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${firstName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Thank you for signing up for StudyBuddy! To complete your registration and start learning, 
              please verify your email address by clicking the button below.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <!-- Primary button with better email client compatibility -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="border-radius: 25px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <a href="${verificationUrl}" 
                       target="_blank"
                       style="display: inline-block; 
                              padding: 15px 30px; 
                              color: white; 
                              text-decoration: none; 
                              border-radius: 25px; 
                              font-weight: bold;
                              font-size: 16px;
                              line-height: 1.2;
                              box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                              border: none;
                              outline: none;">
                      ✅ Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>
            </div>
            
            <!-- Alternative text link for better compatibility -->
            <div style="text-align: center; margin: 20px 0;">
              <p style="color: #666; margin-bottom: 15px; font-size: 14px;">
                <strong>Having trouble with the button?</strong>
              </p>
              <a href="${verificationUrl}" 
                 target="_blank"
                 style="color: #667eea; 
                        text-decoration: underline; 
                        font-weight: bold;
                        font-size: 16px;">
                Click here to verify your email
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              If neither option works, you can copy and paste this link into your browser:
            </p>
            
            <div style="background: #e9ecef; padding: 15px; border-radius: 5px; word-break: break-all; margin-bottom: 20px;">
              <code style="color: #495057; font-family: 'Courier New', monospace; font-size: 14px;">
                ${verificationUrl}
              </code>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                <strong>💡 Tip:</strong> Some email clients may block buttons. If the button doesn't work, 
                try the text link above or copy-paste the URL into your browser.
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-top: 25px; font-size: 14px;">
              This verification link will expire in 24 hours. If you didn't create a StudyBuddy account, 
              you can safely ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
            
            <p style="color: #999; text-align: center; font-size: 12px;">
              © 2024 StudyBuddy. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw error;
    }
  }

  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
    firstName: string
  ) {
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Reset Your StudyBuddy Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">StudyBuddy</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Password Reset</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${firstName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              We received a request to reset your password. Click the button below to create a new password.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        display: inline-block; 
                        font-weight: bold;
                        box-shadow: 0 4px 15px rgba(220, 53, 69, 0.4);">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              If you didn't request a password reset, you can safely ignore this email.
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-top: 25px; font-size: 14px;">
              This reset link will expire in 1 hour for security reasons.
            </p>
            
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
            
            <p style="color: #999; text-align: center; font-size: 12px;">
              © 2024 StudyBuddy. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log("Password reset email sent successfully:", result.messageId);
      return true;
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw error;
    }
  }

  async testConnection() {
    try {
      await this.transporter.verify();
      console.log("Email service connection verified successfully");
      return true;
    } catch (error) {
      console.error("Email service connection failed:", error);
      return false;
    }
  }
}

export default new EmailService();
