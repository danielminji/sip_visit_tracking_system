import emailjs from '@emailjs/browser';

// --- EmailJS Configuration ---
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const ADMIN_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID;
const USER_STATUS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_USER_STATUS_TEMPLATE_ID;

// --- Application Configuration ---
const APP_NAME = import.meta.env.VITE_APP_NAME || 'SIP+ School Visit Tracking';
const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin;
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

// --- Initialize EmailJS ---
if (PUBLIC_KEY) {
  emailjs.init(PUBLIC_KEY);
} else {
  console.error('EmailJS Public Key is missing. Please check your .env file.');
}

// --- Core Email Sending Function ---
export const sendEmail = async (templateId: string, data: Record<string, unknown>): Promise<void> => {
  if (!SERVICE_ID || !templateId || !PUBLIC_KEY) {
    const missing = [!SERVICE_ID && 'Service ID', !templateId && 'Template ID', !PUBLIC_KEY && 'Public Key'].filter(Boolean).join(', ');
    console.error(`EmailJS configuration is incomplete. Missing: ${missing}`);
    throw new Error('Email configuration is incomplete.');
  }

  try {
    await emailjs.send(SERVICE_ID, templateId, data);
    console.log(`Email sent successfully using template ${templateId}.`);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email.');
  }
};

// --- Template-Specific Functions ---

/**
 * Sends a notification to the admin about a new user registration.
 */
export const sendAdminNotification = async (userData: { name: string; email: string; phone?: string }) => {
  if (!ADMIN_EMAIL) {
    console.error('Admin email is not configured.');
    return;
  }
  
  const emailData = {
    // For EmailJS template fields
    to_email: ADMIN_EMAIL,
    from_name: APP_NAME,
    user_name: userData.name,
    user_email: userData.email, // Used in the 'Reply To' field
    user_phone: userData.phone || 'Not provided',
    app_url: 'https://sipplus.vercel.app/login',
  };

  await sendEmail(ADMIN_TEMPLATE_ID, emailData);
};

/**
 * Sends a status update (approved/rejected) to a user.
 */
export const sendUserStatusUpdate = async (userData: { name: string; email: string; status: 'approved' | 'rejected'; reason?: string; }) => {
  const isApproved = userData.status === 'approved';

  const loginButtonHtml = isApproved
    ? `<a href="https://sipplus.vercel.app/login" target="_blank" style="display: inline-block; text-decoration: none; outline: none; color: #fff; background-color: #fc8038; padding: 12px 24px; border-radius: 4px;">Login to Your Account</a>`
    : '';

  const emailData = {
    // For EmailJS template fields
    to_email: userData.email,
    to_name: userData.name,
    subject: isApproved ? `Welcome to ${APP_NAME}! Your Registration is Approved` : `Update on Your ${APP_NAME} Registration`,
    status_title: isApproved ? 'Registration Approved!' : 'Registration Rejected',
    status_message: isApproved
      ? `Your account has been successfully created and you can now log in.`
      : `We have reviewed your registration and unfortunately, it has been rejected.`,
    admin_notes: userData.reason || 'No specific reason was provided.',
    login_button: loginButtonHtml,
    app_url: 'https://sipplus.vercel.app/login',
  };

  await sendEmail(USER_STATUS_TEMPLATE_ID, emailData);
};
