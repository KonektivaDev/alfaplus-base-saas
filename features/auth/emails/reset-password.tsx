import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  userName: string;
  userEmail: string;
  resetLink: string;
}

const ResetPasswordEmail = (props: ResetPasswordEmailProps) => {
  const { userName, userEmail, resetLink } = props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Reset your password - Action required</Preview>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-sm max-w-[600px] mx-auto p-[40px]">
            {/* Header */}
            <Section className="text-center mb-[32px]">
              <Heading className="text-[28px] font-bold text-gray-900 m-0 mb-[8px]">
                Reset Your Password
              </Heading>
              <Text className="text-[16px] text-gray-600 m-0">
                We received a request to reset your password
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="text-[16px] text-gray-700 leading-[24px] m-0 mb-[16px]">
                Hello {userName},
              </Text>
              <Text className="text-[16px] text-gray-700 leading-[24px] m-0 mb-[16px]">
                We received a request to reset the password for your account
                associated with <strong>{userEmail}</strong>.
              </Text>
              <Text className="text-[16px] text-gray-700 leading-[24px] m-0 mb-[24px]">
                Click the button below to create a new password. This link will
                expire in 24 hours for security reasons.
              </Text>
            </Section>

            {/* Reset Button */}
            <Section className="text-center mb-[32px]">
              <Button
                href={resetLink}
                style={{ backgroundColor: "oklch(0.6002 0.1038 184.704)" }}
                className="text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border inline-block"
              >
                Reset Password
              </Button>
            </Section>

            {/* Alternative Link */}
            <Section className="mb-[32px]">
              <Text className="text-[14px] text-gray-600 leading-[20px] m-0 mb-[8px]">
                If the button doesn&apos;t work, copy and paste this link into
                your browser:
              </Text>
              <Link
                href={resetLink}
                style={{ color: "oklch(0.6002 0.1038 184.704)" }}
                className="text-[14px] break-all"
              >
                {resetLink}
              </Link>
            </Section>

            {/* Security Notice */}
            <Section className="border-t border-gray-200 pt-[24px] mb-[32px]">
              <Text className="text-[14px] text-gray-600 leading-[20px] m-0 mb-[12px]">
                <strong>Security reminder:</strong>
              </Text>
              <Text className="text-[14px] text-gray-600 leading-[20px] m-0 mb-[8px]">
                • If you didn&apos;t request this password reset, please ignore
                this email
              </Text>
              <Text className="text-[14px] text-gray-600 leading-[20px] m-0 mb-[8px]">
                • Never share your password or reset links with anyone
              </Text>
              <Text className="text-[14px] text-gray-600 leading-[20px] m-0">
                • This link expires in 24 hours for your security
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-200 pt-[24px]">
              <Text className="text-[12px] text-gray-500 leading-[16px] m-0 mb-[8px]">
                Best regards,
                <br />
                Konektiva Team
              </Text>
              <Text className="text-[12px] text-gray-500 leading-[16px] m-0 mb-[16px]">
                ul. Świeradowska 47, 02-662 Warszawa
              </Text>
              <Text className="text-[12px] text-gray-500 leading-[16px] m-0">
                |<span className="ml-[8px]">© 2025 Konektiva SC</span>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ResetPasswordEmail;
