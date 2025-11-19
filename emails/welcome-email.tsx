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

type WelcomeEmailProps = {
	toName: string;
	appUrl: string;
};

const WelcomeEmail = ({ toName, appUrl }: WelcomeEmailProps) => (
	<Html>
		<Tailwind>
			<Head>
				<style>{`
          .space-y-2 > * + * {
            margin-top: 0.5rem;
          }
          .hover\\:bg-blue-700:hover {
            background-color: #1d4ed8;
          }
        `}</style>
			</Head>
			<Body className="m-8 text-center font-sans">
				<Container>
					<Heading className="font-bold text-3xl text-gray-900">
						Welcome to TicketBounty! 🎉
					</Heading>
					<Section className="mt-6">
						<Text className="text-lg">Hello {toName}</Text>
					</Section>
					<Section className="mt-4">
						<Text className="text-gray-700">
							Thank you for joining TicketBounty! We're excited to have you on
							board.
						</Text>
						<Text className="mt-4 text-gray-700">
							Your account has been successfully created and you can now:
						</Text>
						<ul className="mt-4 space-y-2 text-left text-gray-600">
							<li> Create and manage support tickets</li>
							<li> Track ticket status and updates</li>
							<li> Collaborate with your team</li>
							<li> Access all our features</li>
						</ul>
					</Section>
					<Section className="mt-8">
						<Button
							className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-lg text-white hover:bg-blue-700"
							href={`${appUrl}/tickets`}
						>
							Get Started
						</Button>
					</Section>
					<Section className="mt-8">
						<Text className="text-gray-600 text-sm">
							If you have any questions or need help getting started, don't
							hesitate to reach out to our support team.
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

WelcomeEmail.PreviewProps = {
	toName: 'John Doe',
	appUrl: 'http://localhost:3000',
} as WelcomeEmailProps;

export default WelcomeEmail;
