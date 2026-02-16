import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface OrganizationInvitationProps {
  inviterName: string;
  organizationName: string;
  invitationLink: string;
}

const OrganizationInvitation = (props: OrganizationInvitationProps) => {
  const { inviterName, organizationName, invitationLink } = props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>{`You have been invited to join ${organizationName}`}</Preview>
        <Body className="bg-gray-100 py-[40px] font-sans">
          <Container className="mx-auto max-w-[600px] rounded-[8px] bg-white px-[32px] py-[40px]">
            <Section>
              <Heading className="mb-[24px] text-center text-[28px] font-bold text-gray-900">
                You are invited to join {organizationName}
              </Heading>

              <Text className="mb-[24px] text-[16px] leading-[24px] text-gray-700">
                {inviterName} invited you to join the {organizationName}{" "}
                organization. Click the button below to accept or reject this
                invitation.
              </Text>

              <Section className="mb-[32px] text-center">
                <Button
                  className="box-border rounded-[8px] bg-[oklch(0.6002_0.1038_184.704)] px-[32px] py-[16px] text-[16px] font-semibold text-white no-underline"
                  href={invitationLink}
                >
                  Manage Invitation
                </Button>
              </Section>

              <Text className="mb-[16px] text-[14px] leading-[20px] text-gray-600">
                If the button doesn&apos;t work, you can copy and paste this
                link into your browser:
              </Text>

              <Text className="mb-[32px] text-[14px] break-all text-[oklch(0.6002_0.1038_184.704)]">
                {invitationLink}
              </Text>

              <Text className="mb-[24px] text-[14px] leading-[20px] text-gray-600">
                If you were not expecting this invitation, you can safely ignore
                this email.
              </Text>
            </Section>

            <Section className="mt-[32px] border-t border-gray-200 pt-[24px]">
              <Text className="m-0 mb-[8px] text-center text-[12px] text-gray-500">
                © 2025 Konektiva SC
              </Text>
              <Text className="m-0 text-center text-[12px] text-gray-500">
                ul. Świeradowska 47, 02-662 Warszawa
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default OrganizationInvitation;
