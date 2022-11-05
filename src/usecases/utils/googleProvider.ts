import * as ClientOAuth2 from 'client-oauth2';

export function createGooglClientOptions() : ClientOAuth2.Options {
  return {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    accessTokenUri: 'https://oauth2.googleapis.com/token',
    authorizationUri: 'https://accounts.google.com/o/oauth2/auth',
    redirectUri: `${process.env.SERVER_URL}/api/oauth2/callback/google`,
    scopes: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
  };
}

