import emailjs from '@emailjs/browser';

// EmailJS Configuration
const SERVICE_ID = 'service_eysurf6';
const TEMPLATE_ID = 'template_d43gz5d';

// Initialize EmailJS
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '');

export interface EmailData {
  to_email: string;
  to_name: string;
  from_name?: string;
  from_email?: string;
  subject: string;
  message: string;
  [key: string]: any;
}

export const sendEmail = async (data: EmailData): Promise<void> => {
  try {
    const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      to_email: data.to_email,
      to_name: data.to_name,
      from_name: data.from_name || 'SIP+ System',
      from_email: data.from_email || 'noreply@sip.edu.my',
      subject: data.subject,
      message: data.message,
      ...data
    });
    
    console.log('Email sent successfully:', result);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

// HTML Email templates for different scenarios
export const emailTemplates = {
  // Admin notification for new registration
  adminNotification: (data: { name: string; email: string; phone?: string }) => ({
    to_email: 'admin@sip.edu.my', // Replace with actual admin email
    to_name: 'SIP+ Administrator',
    subject: 'New User Registration Pending Approval',
    message: `
<div style="font-family: system-ui, sans-serif, Arial; font-size: 16px; background-color: #fff8f1">
  <div style="max-width: 600px; margin: auto; padding: 16px">
    <a style="text-decoration: none; outline: none" href="${window.location.origin}" target="_blank">
      <img
        style="height: 32px; vertical-align: middle"
        height="32px"
        src="cid:logo.png"
        alt="SIP+ Logo"
      />
    </a>
    <h2 style="color: #333; margin: 20px 0;">New User Registration Pending Approval</h2>
    <p>A new user has registered for SIP+ School Visit Tracking:</p>
    <div style="background-color: #f8f9fa; padding: 16px; border-radius: 8px; margin: 16px 0;">
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
    </div>
    <p>Please review and approve/reject this registration in the admin dashboard.</p>
    <p>
      <a
        style="
          display: inline-block;
          text-decoration: none;
          outline: none;
          color: #fff;
          background-color: #fc0038;
          padding: 8px 16px;
          border-radius: 4px;
        "
        href="${window.location.origin}/admin"
        target="_blank"
      >
        Go to Admin Dashboard
      </a>
    </p>
    <p>Best regards,<br />SIP+ System</p>
  </div>
</div>
    `.trim()
  }),

  // User approval notification
  userApproval: (data: { name: string; email: string }) => ({
    to_email: data.email,
    to_name: data.name,
    subject: 'Welcome to SIP+ School Visit Tracking!',
    message: `
<div style="font-family: system-ui, sans-serif, Arial; font-size: 16px; background-color: #fff8f1">
  <div style="max-width: 600px; margin: auto; padding: 16px">
    <a style="text-decoration: none; outline: none" href="${window.location.origin}" target="_blank">
      <img
        style="height: 32px; vertical-align: middle"
        height="32px"
        src="cid:logo.png"
        alt="SIP+ Logo"
      />
    </a>
    <h2 style="color: #333; margin: 20px 0;">Welcome to SIP+ School Visit Tracking!</h2>
    <p>Dear ${data.name},</p>
    <p>Great news! Your SIP+ School Visit Tracking account has been approved.</p>
    <p>You can now log in to your account and start using the system to:</p>
    <ul style="margin: 16px 0; padding-left: 20px;">
      <li>Create and manage school visits</li>
      <li>Generate PDF reports</li>
      <li>Track visit history</li>
      <li>Upload photo evidence</li>
    </ul>
    <p>
      <a
        style="
          display: inline-block;
          text-decoration: none;
          outline: none;
          color: #fff;
          background-color: #fc0038;
          padding: 8px 16px;
          border-radius: 4px;
        "
        href="${window.location.origin}/login"
        target="_blank"
      >
        Login to SIP+
      </a>
    </p>
    <p>If you have any questions or need help getting started, our support team is just an email away at
      <a href="mailto:support@sip.edu.my" style="text-decoration: none; outline: none; color: #fc0038">support@sip.edu.my</a>. 
      We're here to assist you every step of the way!
    </p>
    <p>Welcome aboard!</p>
    <p>Best regards,<br />The SIP+ Team</p>
  </div>
</div>
    `.trim()
  }),

  // User rejection notification
  userRejection: (data: { name: string; email: string; reason?: string }) => ({
    to_email: data.email,
    to_name: data.name,
    subject: 'SIP+ Account Registration Update',
    message: `
<div style="font-family: system-ui, sans-serif, Arial; font-size: 16px; background-color: #fff8f1">
  <div style="max-width: 600px; margin: auto; padding: 16px">
    <a style="text-decoration: none; outline: none" href="${window.location.origin}" target="_blank">
      <img
        style="height: 32px; vertical-align: middle"
        height="32px"
        src="cid:logo.png"
        alt="SIP+ Logo"
      />
    </a>
    <h2 style="color: #333; margin: 20px 0;">SIP+ Account Registration Update</h2>
    <p>Dear ${data.name},</p>
    <p>We regret to inform you that your SIP+ School Visit Tracking registration has not been approved at this time.</p>
    ${data.reason ? `<div style="background-color: #f8f9fa; padding: 16px; border-radius: 8px; margin: 16px 0;">
      <p><strong>Reason:</strong> ${data.reason}</p>
    </div>` : '<p>Please contact the administrator for more information.</p>'}
    <p>If you believe this is an error or would like to provide additional information, please contact the administrator at
      <a href="mailto:admin@sip.edu.my" style="text-decoration: none; outline: none; color: #fc0038">admin@sip.edu.my</a>.
    </p>
    <p>Best regards,<br />The SIP+ Team</p>
  </div>
</div>
    `.trim()
  })
};

// Convenience functions
export const sendAdminNotification = async (userData: { name: string; email: string; phone?: string }) => {
  const emailData = emailTemplates.adminNotification(userData);
  await sendEmail(emailData);
};

export const sendUserApproval = async (userData: { name: string; email: string }) => {
  const emailData = emailTemplates.userApproval(userData);
  await sendEmail(emailData);
};

export const sendUserRejection = async (userData: { name: string; email: string; reason?: string }) => {
  const emailData = emailTemplates.userRejection(userData);
  await sendEmail(emailData);
};
