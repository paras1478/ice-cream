const { getTransporter } = require('../config/email');
const logger = require('../config/logger');

/**
 * Send an email
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} [options.text] - Plain text fallback
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = getTransporter();
    if (!transporter) {
      logger.warn(`Email not sent (no transporter): ${subject} to ${to}`);
      return false;
    }

    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'Ice Cream Store'}" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    });

    logger.info(`Email sent: ${info.messageId} to ${to}`);
    return true;
  } catch (error) {
    logger.error(`Failed to send email to ${to}: ${error.message}`);
    return false;
  }
};

module.exports = sendEmail;
