import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const Oauth2client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    'http://localhost:5173'
);

// console.log("token " + GOOGLE_CLIENT_ID);
// console.log("this is Oauth2client " + JSON.stringify(Oauth2client));

const initializeOAuthClient =  () => {
    return Oauth2client;
};

export default initializeOAuthClient;