import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Section,
	Tailwind,
	Text,
} from '@react-email/components';

type EmailOTPVerificationProps = {
	toName: string;
	otp: string;
	type: 'sign-in' | 'email-verification' | 'forget-password';
};

const EmailOTPVerification = ({
	toName,
	otp,
	type,
}: EmailOTPVerificationProps) => {
	const getSubject = () => {
		switch (type) {
			case 'sign-in':
				return 'Your Sign-In Code';
			case 'email-verification':
				return 'Verify Your Email Address';
			case 'forget-password':
				return 'Reset Your Password';
			default:
				return 'Your Verification Code';
		}
	};

	const getMessage = () => {
		switch (type) {
			case 'sign-in':
				return 'Use the code below to sign in to your account:';
			case 'email-verification':
				return 'Use the code below to verify your email address:';
			case 'forget-password':
				return 'Use the code below to reset your password:';
			default:
				return 'Use the code below to complete your request:';
		}
	};

	return (
		<Html>
			<Head />
			<Tailwind>
				<Body className="m-8 text-center font-sans">
					<Container>
						<Heading>{getSubject()}</Heading>
						<Section>
							<Text>Hello {toName}</Text>
						</Section>
						<Section>
							<Text>{getMessage()}</Text>
							<Text className="my-6 font-bold text-4xl text-blue-600 tracking-widest">
								{otp}
							</Text>
							<Text className="text-gray-600 text-sm">
								This code will expire in 5 minutes for security reasons.
							</Text>
						</Section>
						<Section>
							<Text className="text-gray-600 text-sm">
								If you didn't request this code, you can safely ignore this
								email.
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

EmailOTPVerification.PreviewProps = {
	toName: 'John Doe',
	otp: '123456',
	type: 'sign-in',
} as EmailOTPVerificationProps;

export default EmailOTPVerification;
