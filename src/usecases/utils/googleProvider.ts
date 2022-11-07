import * as ClientOAuth2 from 'client-oauth2';

export function createGooglClientOptions(uuid:string) : ClientOAuth2.Options {

  return {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    accessTokenUri: 'https://oauth2.googleapis.com/token',
    authorizationUri: `https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&prompt=consent`,
    redirectUri: `${process.env.SERVER_URL}/api/oauth2/callback/google?uuid=${uuid}`,
    scopes: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
  };
}

