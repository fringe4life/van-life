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

type EmailVerificationProps = {
	toName: string;
	url: string;
};

const _baseUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: '';

const EmailVerification = ({ toName, url }: EmailVerificationProps) => (
	<Html>
		<Head />
		<Tailwind>
			<Body className="m-8 text-center font-sans">
				<Container>
					<Heading>Verify Your Email Address</Heading>
					<Section>
						<Text>Hello {toName}</Text>
					</Section>
					<Section>
						<Text>
							Thank you for signing up! Please verify your email address to
							complete your registration.
						</Text>
						<Text>Click the button below to verify your email:</Text>
						<Button
							className="m-2 cursor-pointer rounded bg-black p-2 text-white"
							href={url}
						>
							Verify Email
						</Button>
					</Section>
					<Section>
						<Text className="text-gray-600 text-sm">
							If you didn't create an account, you can safely ignore this email.
						</Text>
					</Section>
				</Container>
			</Body>
		</Tailwind>
	</Html>
);

EmailVerification.PreviewProps = {
	toName: 'John Doe',
	url: 'https://example.com/verify-email?token=abc123',
} as EmailVerificationProps;

export default EmailVerification;
