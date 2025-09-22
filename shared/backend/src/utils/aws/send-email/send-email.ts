import { SendEmailCommand } from '@aws-sdk/client-ses';
import { awsClients } from 'shared/backend/src/config';
import { SendEmailProps } from './types';

export async function sendEmail({ from, to, subject, body, replyTo }: SendEmailProps): Promise<boolean> {
  try {
    const toAddresses: string[] = Array.isArray(to) ? to : [to];
    const replyToAddresses: string[] = replyTo ? (Array.isArray(replyTo) ? replyTo : [replyTo]) : toAddresses;

    const command = new SendEmailCommand({
      Source: from,
      Destination: { ToAddresses: toAddresses },
      ReplyToAddresses: replyToAddresses,
      Message: {
        Subject: { Charset: 'UTF-8', Data: subject },
        Body: { Html: { Charset: 'UTF-8', Data: body } },
      },
    });

    await awsClients().ses.send(command);
    return true;
  } catch (err) {
    console.error('Error sending email:', err);
    return false;
  }
}
