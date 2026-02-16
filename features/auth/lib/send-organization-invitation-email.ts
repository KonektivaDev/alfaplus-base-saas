import { Resend } from "resend";
import OrganizationInvitation from "../emails/organization-invitation";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function sendOrganizationInviteEmail({
  email,
  organization,
  invitation,
  inviter,
}: {
  email: string;
  organization: { name: string };
  invitation: { id: string };
  inviter: { name: string };
}) {
  return await resend.emails.send({
    from: process.env.FROM_EMAIL as string,
    to: email,
    subject: `You're invited to join the ${organization.name} organization`,
    react: OrganizationInvitation({
      inviterName: inviter.name,
      organizationName: organization.name,
      invitationLink: `${process.env.BETTER_AUTH_URL}/organizations/invites/${invitation.id}`,
    }),
  });
}
