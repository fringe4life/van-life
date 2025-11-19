import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Section,
	Tailwind,
	Text,
} from '@react-email/components';

type PasswordChangedEmailProps = {
	toName: string;
	appUrl: string;
};

const PasswordChangedEmail = ({
	toName,
	appUrl,
}: PasswordChangedEmailProps) => (
	<Html>
		<Tailwind>
			<Head>
				<style>{`
          .hover\\:bg-blue-700:hover {
            background-color: #1d4ed8;
          }
        `}</style>
			</Head>
			<Body className="m-8 text-center font-sans">
				<Container>
					<Heading className="font-bold text-3xl text-gray-900">
						Password Changed Successfully
					</Heading>
					<Section className="mt-6">
						<Text className="text-lg">Hello {toName}</Text>
					</Section>
					<Section className="mt-4">
						<Text className="text-gray-700">
							This email confirms that your password has been successfully
							changed.
						</Text>
						<Text className="mt-4 text-gray-700">
							If you did not make this change, please contact our support team
							immediately.
						</Text>
					</Section>
					<Section className="mt-8">
						<Button
							className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-lg text-white hover:bg-blue-700"
							href={`${appUrl}/account/profile`}
						>
							View Account
						</Button>
					</Section>
					<Section className="mt-8">
						<Text className="text-gray-600 text-sm">
							For security reasons, if this wasn't you, please secure your
							account immediately.
						</Text>
						<Text className="mt-2 text-gray-600 text-sm">
							Best regards,
							<br />
							The TicketBounty Team
						</Text>
					</Section>
				</Container>
			</Body>
		</Tailwind>
	</Html>
);

PasswordChangedEmail.PreviewProps = {
	toName: 'John Doe',
	appUrl: 'http://localhost:3000',
} as PasswordChangedEmailProps;

export default PasswordChangedEmail;
