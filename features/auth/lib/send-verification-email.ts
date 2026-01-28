import { User } from "better-auth";

import { Resend } from "resend";
import EmailVerification from "../emails/email-verification";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function sendVerificationEmail({
  user,
  url,
}: {
  user: User;
  url: string;
}) {
  return await resend.emails.send({
    from: process.env.FROM_EMAIL as string,
    to: user.email as string,
    subject: "Verify your email address",
    react: EmailVerification({
      userName: user.name as string,
      verificationLink: url,
    }),

  });

}
