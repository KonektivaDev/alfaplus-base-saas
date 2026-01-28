import { User } from "better-auth";
import { Resend } from "resend";
import ResetPasswordEmail from "../emails/reset-password";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function sendResetPasswordEmail({
  user,
  url,
}: {
  user: User;
  url: string;
}) {
  return await resend.emails.send({
    from: process.env.FROM_EMAIL as string,
    to: user.email as string,
    subject: "Reset your password",
    react: ResetPasswordEmail({
      userName: user.name as string,
      userEmail: user.email as string,
      resetLink: url,
    }),
  });
}
