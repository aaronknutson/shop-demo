const nodemailer = require('nodemailer');
const logger = require('../config/logger');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
};

/**
 * Send contact form notification email
 */
const sendContactNotification = async (contactData) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: process.env.EMAIL_TO,
    subject: `New Contact Form Submission - Auto Shop Demo`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${contactData.name}</p>
      <p><strong>Email:</strong> ${contactData.email}</p>
      <p><strong>Phone:</strong> ${contactData.phone}</p>
      <p><strong>Message:</strong></p>
      <p>${contactData.message}</p>
      <hr>
      <p><small>Submitted at ${new Date().toLocaleString()}</small></p>
    `,
    text: `
      New Contact Form Submission

      Name: ${contactData.name}
      Email: ${contactData.email}
      Phone: ${contactData.phone}

      Message:
      ${contactData.message}

      Submitted at ${new Date().toLocaleString()}
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Contact notification email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Failed to send contact notification email:', error);
    throw error;
  }
};

/**
 * Send quote request notification email
 */
const sendQuoteNotification = async (quoteData) => {
  const transporter = createTransporter();

  const vehicleInfo = quoteData.vehicleYear || quoteData.vehicleMake || quoteData.vehicleModel
    ? `<p><strong>Vehicle:</strong> ${quoteData.vehicleYear || ''} ${quoteData.vehicleMake || ''} ${quoteData.vehicleModel || ''}</p>`
    : '';

  const preferredDateInfo = quoteData.preferredDate
    ? `<p><strong>Preferred Date:</strong> ${new Date(quoteData.preferredDate).toLocaleDateString()}</p>`
    : '';

  const additionalMessage = quoteData.message
    ? `<p><strong>Additional Notes:</strong></p><p>${quoteData.message}</p>`
    : '';

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: process.env.EMAIL_TO,
    subject: `New Quote Request - ${quoteData.serviceType} - Auto Shop Demo`,
    html: `
      <h2>New Quote Request</h2>
      <p><strong>Name:</strong> ${quoteData.name}</p>
      <p><strong>Email:</strong> ${quoteData.email}</p>
      <p><strong>Phone:</strong> ${quoteData.phone}</p>
      <p><strong>Service Type:</strong> ${quoteData.serviceType}</p>
      ${vehicleInfo}
      ${preferredDateInfo}
      ${additionalMessage}
      <hr>
      <p><small>Submitted at ${new Date().toLocaleString()}</small></p>
    `,
    text: `
      New Quote Request

      Name: ${quoteData.name}
      Email: ${quoteData.email}
      Phone: ${quoteData.phone}
      Service Type: ${quoteData.serviceType}
      ${quoteData.vehicleYear || quoteData.vehicleMake || quoteData.vehicleModel ? `Vehicle: ${quoteData.vehicleYear || ''} ${quoteData.vehicleMake || ''} ${quoteData.vehicleModel || ''}` : ''}
      ${quoteData.preferredDate ? `Preferred Date: ${new Date(quoteData.preferredDate).toLocaleDateString()}` : ''}
      ${quoteData.message ? `\nAdditional Notes:\n${quoteData.message}` : ''}

      Submitted at ${new Date().toLocaleString()}
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Quote notification email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Failed to send quote notification email:', error);
    throw error;
  }
};

module.exports = {
  sendContactNotification,
  sendQuoteNotification
};
