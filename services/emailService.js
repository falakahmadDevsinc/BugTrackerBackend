// import nodemailer from "nodemailer";
// import config from "../utils/config/config.js";

// const transporter = nodemailer.createTransport({
//   service: config.emailService,
//   auth: {
//     user: config.emailUser,
//     pass: config.emailPass,
//   },
// });
// export const sendOTPEmail = async (email, otp) => {
//   await transporter.sendMail({
//     from: `"Bug Tracker" <${config.emailUser}>`,
//     to: email,
//     subject: "Your OTP Code",
//     text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
//   });
// };

// export const sendProjectAddedEmail = async (email, projectName) => {
//   await transporter.sendMail({
//     from: `"Bug Tracker" <${config.emailUser}>`,
//     to: email,
//     subject: `Added to Project: ${projectName}`,
//     text: `You have been added to the project "${projectName}". Please log in to view details.`,
//   });
// };

// export const sendProjectRemovedEmail = async (email, projectName) => {
//   await transporter.sendMail({
//     from: `"Bug Tracker" <${config.emailUser}>`,
//     to: email,
//     subject: `Removed from Project: ${projectName}`,
//     text: `You have been removed from the project "${projectName}".`,
//   });
// };

// Latest One
import nodemailer from "nodemailer";
import config from "../utils/config/config.js";

const transporter = nodemailer.createTransport({
  service: config.emailService,
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
  },
});

// Base email template
const emailTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bug Tracker</title>
  <style>
    /* Responsive styles */
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        border-radius: 0 !important;
      }
      .content {
        padding: 24px !important;
      }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#f5f5f5; font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f5f5f5;">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table class="container" role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" 
          style="background-color:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#4F46E5,#4338CA); padding:36px;" align="center">
              <h1 style="margin:0; font-size:26px; font-weight:700; color:#fff;">Bug Tracker</h1>
              <p style="margin:8px 0 0 0; color:#e0e7ff; font-size:14px;">Track • Fix • Ship faster</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content" style="padding:40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px; background-color:#f9fafb; text-align:center; font-size:13px; color:#6b7280;">
              <p style="margin:0 0 6px 0;">This is an automated message from Bug Tracker.</p>
              <p style="margin:0;">© ${new Date().getFullYear()} Bug Tracker. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// OTP Email Template
const otpEmailContent = (otp) => `
  <h2 style="margin: 0 0 24px 0; color: #111827; font-size: 24px; font-weight: 600;">
    Verify Your Account
  </h2>

  <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 24px;">
    You've requested a one-time password to access your Bug Tracker account. Please use the code below to complete your authentication.
  </p>

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
    <tr>
      <td align="center">
        <div style="background-color: #f3f4f6; border: 2px dashed #d1d5db; border-radius: 8px; padding: 24px; display: inline-block;">
          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
            Your OTP Code
          </p>
          <p style="margin: 0; color: #111827; font-size: 32px; font-weight: 700; letter-spacing: 8px;">
            ${otp}
          </p>
        </div>
      </td>
    </tr>
  </table>

  <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 4px;">
    <p style="margin: 0; color: #92400e; font-size: 14px;">
      <strong>⏱️ Time Sensitive:</strong> This code will expire in 5 minutes for security reasons.
    </p>
  </div>

  <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px; line-height: 21px;">
    If you didn't request this code, please ignore this email or contact our support team if you have concerns about your account security.
  </p>
`;

// Project Added Email Template
const projectAddedContent = (projectName, projectDetails = {}) => `
  <h2 style="margin: 0 0 24px 0; color: #111827; font-size: 24px; font-weight: 600;">
    Welcome to ${projectName}! 🎉
  </h2>

  <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 24px;">
    Great news! You've been added as a team member to the project <strong>${projectName}</strong>. You can now collaborate with your team to track and resolve issues efficiently.
  </p>

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
    <tr>
      <td align="center">
        <a href="${config.clientOrigin}/dashboard" style="display: inline-block; background-color: #4F46E5; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 12px 32px; border-radius: 6px;">
          View Project
        </a>
      </td>
    </tr>
  </table>

  <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin: 24px 0;">
    <h3 style="margin: 0 0 16px 0; color: #111827; font-size: 18px; font-weight: 600;">
      What you can do now:
    </h3>
    <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 24px;">
      <li>View and create bug reports</li>
      <li>Track project progress on the dashboard</li>
      <li>Collaborate with team members</li>
      <li>Update bug statuses and priorities</li>
    </ul>
  </div>

  <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px; line-height: 21px;">
    Need help getting started? Check out our <a href="${config.clientOrigin}/dashboard" style="color: #4F46E5; text-decoration: none;">documentation</a> or contact your project manager.
  </p>
`;

// Project Removed Email Template
const projectRemovedContent = (projectName) => `
  <h2 style="margin: 0 0 24px 0; color: #111827; font-size: 24px; font-weight: 600;">
    Project Access Update
  </h2>

  <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 24px;">
    We wanted to inform you that your access to the project <strong>${projectName}</strong> has been removed.
  </p>

  <div style="background-color: #f3f4f6; border-radius: 8px; padding: 24px; margin: 24px 0;">
    <p style="margin: 0 0 8px 0; color: #111827; font-size: 16px; font-weight: 600;">
      What this means:
    </p>
    <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 24px;">
      <li>You no longer have access to this project's bugs and reports</li>
      <li>Your previous contributions remain in the project history</li>
      <li>You can still access your other active projects</li>
    </ul>
  </div>

  <p style="margin: 24px 0; color: #4b5563; font-size: 14px; line-height: 21px;">
    If you believe this was done in error or have questions about this change, please contact your project administrator or team lead.
  </p>

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
    <tr>
      <td align="center">
        <a href="${config.clientOrigin}/dashboard" style="display: inline-block; background-color: #e5e7eb; color: #374151; font-size: 16px; font-weight: 600; text-decoration: none; padding: 12px 32px; border-radius: 6px;">
          View Active Projects
        </a>
      </td>
    </tr>
  </table>
`;

// Email sending functions
export const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"Bug Tracker" <${config.emailUser}>`,
    to: email,
    subject: "🔐 Your Bug Tracker Verification Code",
    html: emailTemplate(otpEmailContent(otp)),
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`, // Fallback plain text
  });
};

export const sendProjectAddedEmail = async (
  email,
  projectName,
  projectDetails = {}
) => {
  await transporter.sendMail({
    from: `"Bug Tracker" <${config.emailUser}>`,
    to: email,
    subject: `🎉 Welcome to ${projectName}`,
    html: emailTemplate(projectAddedContent(projectName, projectDetails)),
    text: `You have been added to the project "${projectName}". Please log in to view details.`, // Fallback plain text
  });
};

export const sendProjectRemovedEmail = async (email, projectName) => {
  await transporter.sendMail({
    from: `"Bug Tracker" <${config.emailUser}>`,
    to: email,
    subject: `Project Update: ${projectName}`,
    html: emailTemplate(projectRemovedContent(projectName)),
    text: `You have been removed from the project "${projectName}".`, // Fallback plain text
  });
};

// Additional email templates we will add later:

// Bug Assignment Email
export const sendBugAssignmentEmail = async (
  email,
  bugTitle,
  projectName,
  priority
) => {
  const content = `
    <h2 style="margin: 0 0 24px 0; color: #111827; font-size: 24px; font-weight: 600;">
      New Bug Assignment
    </h2>

    <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 24px;">
      You've been assigned to work on a new bug in <strong>${projectName}</strong>.
    </p>

    <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin: 24px 0;">
      <h3 style="margin: 0 0 8px 0; color: #111827; font-size: 18px; font-weight: 600;">
        ${bugTitle}
      </h3>
      <p style="margin: 0; color: #4b5563; font-size: 14px;">
        Priority: <span style="color: ${
          priority === "high"
            ? "#dc2626"
            : priority === "medium"
            ? "#f59e0b"
            : "#10b981"
        }; font-weight: 600;">
          ${priority.toUpperCase()}
        </span>
      </p>
    </div>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
      <tr>
        <td align="center">
          <a href="${
            config.appUrl
          }/bugs" style="display: inline-block; background-color: #4F46E5; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 12px 32px; border-radius: 6px;">
            View Bug Details
          </a>
        </td>
      </tr>
    </table>
  `;

  await transporter.sendMail({
    from: `"Bug Tracker" <${config.emailUser}>`,
    to: email,
    subject: `🐛 New Bug Assignment: ${bugTitle}`,
    html: emailTemplate(content),
    text: `You've been assigned to work on "${bugTitle}" in ${projectName}.`,
  });
};
