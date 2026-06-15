const baseStyle = `
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #f8f9fa; }
  .container { max-width: 600px; margin: 30px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
  .header { background: linear-gradient(135deg, #ff6b9d, #c44dff); padding: 40px 30px; text-align: center; }
  .header h1 { color: white; margin: 0; font-size: 28px; }
  .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 16px; }
  .logo { font-size: 40px; margin-bottom: 10px; }
  .body { padding: 35px 30px; color: #333; line-height: 1.6; }
  .footer { background: #f8f9fa; padding: 20px 30px; text-align: center; color: #888; font-size: 13px; border-top: 1px solid #eee; }
  .btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #ff6b9d, #c44dff); color: white; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; margin: 20px 0; }
  .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
  .order-table th { background: #ff6b9d; color: white; padding: 12px; text-align: left; }
  .order-table td { padding: 12px; border-bottom: 1px solid #eee; }
  .order-table tr:last-child td { border-bottom: none; }
  .totals-row { background: #fff5f9; font-weight: bold; }
  .status-bar { display: flex; justify-content: space-between; margin: 25px 0; }
  .status-step { text-align: center; flex: 1; }
  .status-dot { width: 16px; height: 16px; border-radius: 50%; margin: 0 auto 6px; background: #ddd; }
  .status-dot.active { background: #ff6b9d; }
  .status-dot.done { background: #4caf50; }
  .alert-box { background: #fff3e0; border-left: 4px solid #ff9800; padding: 15px 20px; border-radius: 4px; margin: 15px 0; }
`;

const welcomeTemplate = ({ name }) => ({
  subject: '🍦 Welcome to Ice Cream Store!',
  html: `
    <!DOCTYPE html><html><head><style>${baseStyle}</style></head><body>
    <div class="container">
      <div class="header">
        <div class="logo">🍦</div>
        <h1>Welcome to Ice Cream Store!</h1>
        <p>We're so excited to have you!</p>
      </div>
      <div class="body">
        <h2>Hello ${name}! 👋</h2>
        <p>Thank you for joining the Ice Cream Store family. We're thrilled to have you on board!</p>
        <p>Here's what you can do:</p>
        <ul>
          <li>🍨 Browse our amazing collection of ice cream flavors</li>
          <li>🛒 Add your favorites to cart</li>
          <li>💳 Checkout securely with Stripe</li>
          <li>📦 Track your orders in real-time</li>
        </ul>
        <p style="text-align:center">
          <a href="${process.env.FRONTEND_URL}/products" class="btn">Shop Now</a>
        </p>
        <p>Use code <strong style="color:#ff6b9d">WELCOME10</strong> for 10% off your first order!</p>
      </div>
      <div class="footer">
        <p>Ice Cream Store &bull; <a href="${process.env.FRONTEND_URL}">icecreamstore.com</a></p>
        <p>You're receiving this because you created an account with us.</p>
      </div>
    </div>
    </body></html>
  `,
});

const orderConfirmationTemplate = ({ name, order }) => {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td>${item.name}</td>
        <td style="text-align:center">${item.quantity}</td>
        <td style="text-align:right">$${item.price.toFixed(2)}</td>
        <td style="text-align:right">$${item.total.toFixed(2)}</td>
      </tr>
    `
    )
    .join('');

  return {
    subject: `Order Confirmed #${order.orderNumber} 🍦`,
    html: `
      <!DOCTYPE html><html><head><style>${baseStyle}</style></head><body>
      <div class="container">
        <div class="header">
          <div class="logo">🍦</div>
          <h1>Order Confirmed!</h1>
          <p>Order #${order.orderNumber}</p>
        </div>
        <div class="body">
          <h2>Hi ${name},</h2>
          <p>Great news! Your ice cream order has been confirmed and we're getting it ready for you.</p>
          <table class="order-table">
            <thead>
              <tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Total</th></tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr><td colspan="3">Subtotal</td><td style="text-align:right">$${order.subtotal.toFixed(2)}</td></tr>
              ${order.discountAmount > 0 ? `<tr><td colspan="3">Discount (${order.couponCode})</td><td style="text-align:right; color:#ff6b9d">-$${order.discountAmount.toFixed(2)}</td></tr>` : ''}
              <tr><td colspan="3">Tax</td><td style="text-align:right">$${order.taxAmount.toFixed(2)}</td></tr>
              <tr><td colspan="3">Shipping</td><td style="text-align:right">${order.shippingFee === 0 ? 'FREE' : '$' + order.shippingFee.toFixed(2)}</td></tr>
              <tr class="totals-row"><td colspan="3"><strong>Total</strong></td><td style="text-align:right"><strong>$${order.total.toFixed(2)}</strong></td></tr>
            </tfoot>
          </table>
          <h3>Shipping to:</h3>
          <p>${order.shippingAddress.fullName}<br>
          ${order.shippingAddress.street}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
          ${order.shippingAddress.country}</p>
          <p style="text-align:center">
            <a href="${process.env.FRONTEND_URL}/orders/${order._id}" class="btn">Track Order</a>
          </p>
        </div>
        <div class="footer">
          <p>Ice Cream Store &bull; Questions? Contact support@icecreamstore.com</p>
        </div>
      </div>
      </body></html>
    `,
  };
};

const orderStatusUpdateTemplate = ({ name, order, newStatus }) => {
  const statusSteps = ['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered'];
  const currentIndex = statusSteps.indexOf(newStatus);

  const statusDotsHtml = statusSteps
    .map((step, i) => {
      const cls = i < currentIndex ? 'done' : i === currentIndex ? 'active' : '';
      const label = step.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      return `<div class="status-step"><div class="status-dot ${cls}"></div><small>${label}</small></div>`;
    })
    .join('');

  const statusEmojis = {
    pending: '⏳',
    confirmed: '✅',
    processing: '🔨',
    out_for_delivery: '🚚',
    delivered: '🎉',
    cancelled: '❌',
  };

  return {
    subject: `Order ${statusEmojis[newStatus] || ''} ${newStatus.replace(/_/g, ' ')} - #${order.orderNumber}`,
    html: `
      <!DOCTYPE html><html><head><style>${baseStyle}</style></head><body>
      <div class="container">
        <div class="header">
          <div class="logo">${statusEmojis[newStatus] || '📦'}</div>
          <h1>Order Update</h1>
          <p>#${order.orderNumber}</p>
        </div>
        <div class="body">
          <h2>Hi ${name},</h2>
          <p>Your order status has been updated to: <strong style="color:#ff6b9d">${newStatus.replace(/_/g, ' ').toUpperCase()}</strong></p>
          <div class="status-bar">${statusDotsHtml}</div>
          ${order.trackingNumber ? `<p>Tracking Number: <strong>${order.trackingNumber}</strong></p>` : ''}
          ${order.estimatedDelivery ? `<p>Estimated Delivery: <strong>${new Date(order.estimatedDelivery).toLocaleDateString()}</strong></p>` : ''}
          <p style="text-align:center">
            <a href="${process.env.FRONTEND_URL}/orders/${order._id}" class="btn">View Order</a>
          </p>
        </div>
        <div class="footer">
          <p>Ice Cream Store &bull; Questions? Contact support@icecreamstore.com</p>
        </div>
      </div>
      </body></html>
    `,
  };
};

const passwordResetTemplate = ({ name, resetUrl }) => ({
  subject: 'Password Reset Request 🔑',
  html: `
    <!DOCTYPE html><html><head><style>${baseStyle}</style></head><body>
    <div class="container">
      <div class="header">
        <div class="logo">🔑</div>
        <h1>Reset Your Password</h1>
      </div>
      <div class="body">
        <h2>Hi ${name},</h2>
        <p>We received a request to reset your Ice Cream Store account password. Click the button below to reset it:</p>
        <p style="text-align:center">
          <a href="${resetUrl}" class="btn">Reset Password</a>
        </p>
        <p style="color:#888; font-size:14px">This link will expire in <strong>10 minutes</strong>. If you didn't request a password reset, please ignore this email.</p>
        <p style="color:#888; font-size:13px">Or copy this URL: ${resetUrl}</p>
      </div>
      <div class="footer">
        <p>Ice Cream Store &bull; Security Alert</p>
      </div>
    </div>
    </body></html>
  `,
});

const lowStockAlertTemplate = ({ products }) => {
  const rows = products
    .map((p) => `<tr><td>${p.name}</td><td>${p.sku || 'N/A'}</td><td style="color:${p.stock === 0 ? '#f44336' : '#ff9800'}">${p.stock}</td></tr>`)
    .join('');

  return {
    subject: `⚠️ Low Stock Alert - ${products.length} Products`,
    html: `
      <!DOCTYPE html><html><head><style>${baseStyle}</style></head><body>
      <div class="container">
        <div class="header">
          <div class="logo">⚠️</div>
          <h1>Low Stock Alert</h1>
          <p>${products.length} products need restocking</p>
        </div>
        <div class="body">
          <div class="alert-box">
            <strong>Action Required:</strong> The following products are running low on stock.
          </div>
          <table class="order-table">
            <thead><tr><th>Product</th><th>SKU</th><th>Stock</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
          <p style="text-align:center">
            <a href="${process.env.FRONTEND_URL}/admin/inventory" class="btn">Manage Inventory</a>
          </p>
        </div>
        <div class="footer">
          <p>Ice Cream Store Admin Notification</p>
        </div>
      </div>
      </body></html>
    `,
  };
};

module.exports = {
  welcomeTemplate,
  orderConfirmationTemplate,
  orderStatusUpdateTemplate,
  passwordResetTemplate,
  lowStockAlertTemplate,
};
