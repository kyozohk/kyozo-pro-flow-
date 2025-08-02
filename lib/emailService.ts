// This is a mock email service for development
// In production, you would integrate with a real email service like SendGrid, Mailgun, etc.

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send an email using the configured email service
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  // In development, we'll just log the email
  console.log('Sending email:', options);
  
  // In production, you would use a real email service
  // Example with SendGrid:
  // await sgMail.send({
  //   to: options.to,
  //   from: options.from || 'noreply@yourapp.com',
  //   subject: options.subject,
  //   html: options.html,
  // });
  
  // Simulate successful email sending
  return true;
};

/**
 * Send an invitation email to a community member
 */
export const sendInvitationEmail = async (
  email: string, 
  inviteToken: string,
  communityName: string,
  inviterName: string,
  customMessage?: string
): Promise<boolean> => {
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${inviteToken}`;
  
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>You've been invited to join ${communityName}</h2>
      <p>${inviterName} has invited you to join their community on our platform.</p>
      
      ${customMessage ? `<p style="padding: 15px; background-color: #f7f7f7; border-left: 4px solid #e0407b; margin: 20px 0;">
        "${customMessage}"
      </p>` : ''}
      
      <p>Click the button below to accept this invitation and set up your account:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${inviteUrl}" style="background-color: #e0407b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
          Accept Invitation
        </a>
      </div>
      
      <p style="color: #666; font-size: 14px;">This invitation will expire in 7 days.</p>
      
      <p style="color: #666; font-size: 14px;">If you're having trouble with the button above, copy and paste this URL into your browser:</p>
      <p style="color: #666; font-size: 14px; word-break: break-all;">${inviteUrl}</p>
    </div>
  `;
  
  return sendEmail({
    to: email,
    subject: `Join ${communityName} on Community Platform`,
    html: emailHtml,
  });
};

/**
 * Send a welcome email to a new community member
 */
export const sendWelcomeEmail = async (
  email: string,
  name: string,
  communityName: string
): Promise<boolean> => {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;
  
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to ${communityName}!</h2>
      <p>Hi ${name},</p>
      <p>You've successfully joined ${communityName} on our platform.</p>
      
      <p>You can now access all community resources and connect with other members.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${dashboardUrl}" style="background-color: #e0407b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
          Go to Dashboard
        </a>
      </div>
      
      <p>We're excited to have you as part of our community!</p>
    </div>
  `;
  
  return sendEmail({
    to: email,
    subject: `Welcome to ${communityName}!`,
    html: emailHtml,
  });
};
