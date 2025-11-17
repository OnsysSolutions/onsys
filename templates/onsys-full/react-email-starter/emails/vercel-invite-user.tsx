import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface VercelInviteUserEmailProps {
  username?: string;
  userImage?: string;
  invitedByUsername?: string;
  invitedByEmail?: string;
  teamName?: string;
  teamImage?: string;
  inviteLink?: string;
  inviteFromIp?: string;
  inviteFromLocation?: string;
  customMessage: string | null;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const VercelInviteUserEmail = ({
  username,
  userImage,
  invitedByUsername,
  invitedByEmail,
  teamName,
  teamImage,
  inviteLink,
  inviteFromIp,
  inviteFromLocation,
  customMessage
}: VercelInviteUserEmailProps) => {
  const previewText = `Join ${invitedByUsername} on Vercel`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}/static/vercel-team.png`}
                width="40"
                height="40"
                alt="Vercel"
                className="mx-auto my-0 rounded-full"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
              Entrar em <strong>{teamName}</strong> no <strong>Arquivo Morto</strong>
            </Heading>
            <Text className="text-[14px] text-black leading-[24px]">
              Olá {username},
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              <strong>{invitedByUsername}</strong> (
              <Link
                href={`mailto:${invitedByEmail}`}
                className="text-blue-600 no-underline"
              >
                {invitedByEmail}
              </Link>
              ) o convidou a se juntar a <strong>{teamName}</strong> no {' '}
              <strong>Arquivo Morto</strong>.
            </Text>
            <Section>
              <Row>
                <Column align="right">
                  <Img
                    className="rounded-full"
                    src={userImage}
                    width="64"
                    height="64"
                  />
                </Column>
                <Column align="center">
                  <Img
                    src={`${baseUrl}/static/vercel-arrow.png`}
                    width="12"
                    height="9"
                    alt="invited you to"
                  />
                </Column>
                <Column align="left">
                  <Img
                    className="rounded-full"
                    src={teamImage}
                    width="64"
                    height="64"
                  />
                </Column>
              </Row>
            </Section>
            {customMessage && (
              <Section>
                <Text className="text-[14px] text-black text-center">
                  {invitedByUsername} disse:
                </Text>
                <Text className="text-[14px] text-black text-center">
                  <em>"{customMessage}"</em>
                </Text>
              </Section>
            )}
          <Section className="mt-[32px] mb-[32px] text-center">
            <Button
              className="rounded bg-[#000000] px-5 py-3 text-center font-semibold text-[12px] text-white no-underline"
              href={inviteLink}
            >
              Entre na Organização
            </Button>
          </Section>
          <Text className="text-[14px] text-black leading-[24px]">
            ou copie e cole esta URL no seu navegador:{' '}
            <Link href={inviteLink} className="text-blue-600 no-underline">
              {inviteLink}
            </Link>
          </Text>
          <Hr className="mx-0 my-[26px] w-full border border-[#eaeaea] border-solid" />
          <Text className="text-[#666666] text-[12px] leading-[24px]">
            Este convite foi intencionado para{' '}
            <span className="text-black">{username}</span>. Este convite foi enviado de <span className="text-black">{inviteFromIp}</span>{' '}
            localizado em{' '}
            <span className="text-black">{inviteFromLocation}</span>.
            Se você não estava esperando este convite ou se você acha que foi um erro, você pode ignorar este email. Se você estiver preocupado com a segurança da sua conta, entre em contato conosco pelo email contato@onsys-solutions.com.br.
          </Text>
        </Container>
      </Body>
    </Tailwind>
    </Html >
  );
};

VercelInviteUserEmail.PreviewProps = {
  username: 'Emanuel',
  userImage: `https://github.com/adeirjunior.png`,
  invitedByUsername: 'Adeir',
  invitedByEmail: '4adeirj@gmail.com',
  teamName: 'Prefeitura São Miguel',
  teamImage: `https://ayddeist2swt7w37.public.blob.vercel-storage.com/avatar/default.webp`,
  inviteLink: 'http://localhost:3000/convite/jkhj23hl2-dh3isffsdjjnsd-fjh20e9-8720h',
  inviteFromIp: '204.13.186.218',
  inviteFromLocation: 'São Paulo, Brasil',
  customMessage: 'Mensagem personalizada de convite'
} as VercelInviteUserEmailProps;

export default VercelInviteUserEmail;
