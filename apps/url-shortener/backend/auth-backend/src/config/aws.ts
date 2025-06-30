import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { SESClient } from '@aws-sdk/client-ses';

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Environment variable ${name} is not defined.`);
  return value;
}

export const awsConfig = () => ({
  cognito: new CognitoIdentityProviderClient({
    region: getEnvVar('AWS_REGION'),
    credentials: {
      accessKeyId: getEnvVar('AWS_ACCESS_KEY_ID'),
      secretAccessKey: getEnvVar('AWS_SECRET_ACCESS_KEY'),
    },
  }),

  ses: new SESClient({
    region: getEnvVar('AWS_REGION'),
    credentials: {
      accessKeyId: getEnvVar('AWS_ACCESS_KEY_ID'),
      secretAccessKey: getEnvVar('AWS_SECRET_ACCESS_KEY'),
    },
  }),
});
