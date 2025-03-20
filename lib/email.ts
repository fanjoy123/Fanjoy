import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    await transporter.sendMail({
      from: `"Fanjoy" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

export async function sendOrderStatusEmail(
  to: string,
  orderId: string,
  status: string,
  amount: number,
  trackingNumber?: string
) {
  const subject = `Fanjoy Order #${orderId} Status Update`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #4F46E5; margin: 0;">Fanjoy</h1>
      </div>
      <h2 style="color: #1F2937;">Order Status Update</h2>
      <p>Your Fanjoy order #${orderId} has been updated to: <strong>${status}</strong></p>
      <p>Amount: $${(amount / 100).toFixed(2)}</p>
      ${trackingNumber ? `<p>Tracking Number: ${trackingNumber}</p>` : ''}
      <p>You can view your order details at: ${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderId}</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
        <p style="color: #6B7280; font-size: 14px;">Thank you for shopping with Fanjoy!</p>
      </div>
    </div>
  `;

  await sendEmail({ to, subject, html });
}

export async function sendCreatorOrderNotification(
  to: string,
  orderId: string,
  amount: number,
  customerEmail: string
) {
  const subject = `New Fanjoy Order Received - #${orderId}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #4F46E5; margin: 0;">Fanjoy</h1>
      </div>
      <h2 style="color: #1F2937;">New Order Received</h2>
      <p>Order ID: ${orderId}</p>
      <p>Amount: $${(amount / 100).toFixed(2)}</p>
      <p>Customer Email: ${customerEmail}</p>
      <p>View order details at: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders/${orderId}</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
        <p style="color: #6B7280; font-size: 14px;">Thank you for being a Fanjoy creator!</p>
      </div>
    </div>
  `;

  await sendEmail({ to, subject, html });
}

export async function sendPayoutNotification(
  to: string,
  amount: number,
  scheduledDate: string
) {
  const subject = 'Fanjoy Payout Scheduled';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #4F46E5; margin: 0;">Fanjoy</h1>
      </div>
      <h2 style="color: #1F2937;">Payout Scheduled</h2>
      <p>A payout of $${(amount / 100).toFixed(2)} has been scheduled for ${new Date(scheduledDate).toLocaleDateString()}.</p>
      <p>View payout details at: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/payouts</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
        <p style="color: #6B7280; font-size: 14px;">Thank you for being a Fanjoy creator!</p>
      </div>
    </div>
  `;

  await sendEmail({ to, subject, html });
} 