import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

export const awsConfig = () => ({
  cognito: new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  }),
});
