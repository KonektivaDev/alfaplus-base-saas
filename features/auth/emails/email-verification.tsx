import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface EmailVerificationProps {
  userName: string;
  verificationLink: string;
}

const EmailVerification = (props: EmailVerificationProps) => {
  const { userName, verificationLink } = props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>
          Please verify your email address to complete your account setup
        </Preview>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] px-[32px] py-[40px] mx-auto max-w-[600px]">
            <Section>
              <Heading className="text-[28px] font-bold text-gray-900 mb-[24px] text-center">
                Verify Your Email Address
              </Heading>

              <Text className="text-[16px] text-gray-700 mb-[24px] leading-[24px]">
                Thank you {userName} for signing up! To complete your account
                setup and start using our services, please verify your email
                address by clicking the button below.
              </Text>

              <Section className="text-center mb-[32px]">
                <Button
                  className="box-border bg-[oklch(0.6002_0.1038_184.704)] text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline"
                  href={verificationLink}
                >
                  Verify Email Address
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 mb-[16px] leading-[20px]">
                If the button doesn&apos;t work, you can copy and paste this
                link into your browser:
              </Text>

              <Text className="text-[14px] text-[oklch(0.6002_0.1038_184.704)] mb-[32px] break-all">
                {verificationLink}
              </Text>

              <Text className="text-[14px] text-gray-600 mb-[24px] leading-[20px]">
                This verification link will expire in 24 hours. If you
                didn&apos;t create an account, you can safely ignore this email.
              </Text>
            </Section>

            <Section className="border-t border-gray-200 pt-[24px] mt-[32px]">
              <Text className="text-[12px] text-gray-500 text-center mb-[8px] m-0">
                © 2025 Konektiva SC
              </Text>
              <Text className="text-[12px] text-gray-500 text-center m-0">
                ul. Świeradowska 47, 02-662 Warszawa
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailVerification;
