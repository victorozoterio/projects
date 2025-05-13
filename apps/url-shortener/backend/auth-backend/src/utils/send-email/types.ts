export interface SendEmailProps {
	from: string;
	to: string | string[];
	subject: string;
	body: string;
	replyTo?: string | string[];
}
