const sendEmail = require('../utils/sendEmail');
const {
  welcomeTemplate,
  orderConfirmationTemplate,
  orderStatusUpdateTemplate,
  passwordResetTemplate,
  lowStockAlertTemplate,
} = require('../utils/emailTemplates');

class EmailService {
  async sendWelcome(user) {
    const tpl = welcomeTemplate({ name: user.name });
    return sendEmail({ to: user.email, ...tpl });
  }

  async sendOrderConfirmation(user, order) {
    const tpl = orderConfirmationTemplate({ name: user.name, order });
    return sendEmail({ to: user.email, ...tpl });
  }

  async sendOrderStatusUpdate(user, order, newStatus) {
    const tpl = orderStatusUpdateTemplate({ name: user.name, order, newStatus });
    return sendEmail({ to: user.email, ...tpl });
  }

  async sendPasswordReset(user, resetUrl) {
    const tpl = passwordResetTemplate({ name: user.name, resetUrl });
    return sendEmail({ to: user.email, ...tpl });
  }

  async sendLowStockAlert(adminEmail, products) {
    const tpl = lowStockAlertTemplate({ products });
    return sendEmail({ to: adminEmail, ...tpl });
  }
}

module.exports = new EmailService();
