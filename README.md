# Fanjoy - Creator Merch Platform

A platform for creators to sell merchandise directly to their fans.

## Features

- Product management
- Order processing
- Secure payments with Stripe
- Email notifications
- Order export functionality
- Creator dashboard

## Deployment

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Vercel account
- Firebase project
- Stripe account
- Resend account (for email)

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the required environment variables:

```bash
cp .env.example .env.local
```

Required environment variables:

- Firebase configuration
- Stripe API keys and webhook secret
- SMTP settings or Resend API key
- Next.js public URLs

### Deploy to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Connect your repository to Vercel
3. Configure environment variables in Vercel project settings
4. Deploy!

### Stripe Webhook Setup

1. Go to your Stripe Dashboard > Developers > Webhooks
2. Add a new webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payout.paid`
4. Copy the webhook signing secret and add it to your environment variables as `STRIPE_WEBHOOK_SECRET`

### Firebase Setup

1. Create a new Firebase project
2. Enable Authentication and Firestore
3. Set up Firestore security rules
4. Copy Firebase configuration to environment variables

### Email Setup

Option 1 - SMTP:
1. Configure your SMTP server settings
2. Add SMTP credentials to environment variables

Option 2 - Resend:
1. Create a Resend account
2. Add your Resend API key to environment variables

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Security

- All API routes are protected with authentication
- Stripe webhooks are validated with signatures
- Firebase security rules are enforced
- Environment variables are properly configured
- HTTPS is enforced in production

## Support

For support, email support@fanjoy.com or visit our [contact page](https://fanjoy.vercel.app/contact).
