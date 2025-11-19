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

type EmailPasswordResetProps = {
	toName: string;
	url: string;
};

const _baseUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: '';

const EmailPasswordReset = ({ toName, url }: EmailPasswordResetProps) => (
	<Html>
		<Head />
		<Tailwind>
			<Body className="m-8 text-center font-sans">
				<Container>
					<Heading>Password Reset</Heading>
					<Section>
						<Text>Hello {toName}</Text>
					</Section>
					<Section>
						<Text>
							You are receiving this email because you (or someone else) have
							requested a password reset for your account.
						</Text>
						<Text>Please click the button below to reset your password:</Text>
						<Button
							className="m-2 cursor-pointer rounded bg-black p-2 text-white"
							href={url}
						>
							Reset Password
						</Button>
					</Section>
				</Container>
			</Body>
		</Tailwind>
	</Html>
);

EmailPasswordReset.PreviewProps = {
	toName: 'John Doe',
	url: 'https://example.com/reset-password',
} as EmailPasswordResetProps;

export default EmailPasswordReset;
