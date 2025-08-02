# Community Management Platform

This is a comprehensive community management platform built with [Next.js](https://nextjs.org), featuring custom UI components, member invitation flows, and team management capabilities.

The project was bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Community Management Features

### Member Invitation Flow

The platform includes a complete member invitation flow:

1. Community Leaders can invite members via email
2. Members receive invitation emails with custom messages
3. Members can accept invitations and complete their profiles
4. Leaders can manage team members and community settings

### Testing the Invitation Flow

To test the end-to-end invitation flow:

1. Ensure Firebase is properly configured in your `.env.local` file
2. Run the test script:

```bash
pnpm test:invite-flow
```

This script will:
- Create a test community
- Send an invitation to a test email
- Verify the invitation email is sent correctly
- Accept the invitation and complete the user profile
- Verify the member appears in the community members list

### Other Features

- **Eventbrite Integration**: Import members from Eventbrite events
- **WhatsApp Messaging**: Send pre-approved messages via WhatsApp (using Sinch/Meta)
- **Team Management**: Invite and manage team members with different roles
- **Community Settings**: Customize community details and manage settings
