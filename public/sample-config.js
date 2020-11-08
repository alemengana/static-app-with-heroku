var config = {
	apiKey: 'YOUR_API_KEY',
	authDomain: 'project-id.firebaseapp.com',
	databaseURL: 'https://project-id.firebaseio.com',
	storageBucket: 'project-id.appspot.com',
};
firebase.initializeApp(config);

// Google OAuth Client ID, needed to support One-tap sign-up.
// Set to null if One-tap sign-up is not supported.
var CLIENT_ID = 'YOUR_OAUTH_CLIENT_ID';

// Parle App Url
// Example: http://localhost:4200
var PARLE_APP_URL = 'YOUR_PARLE_APP_URL';
// Parle App Domain
// Example: localhost
var PARLE_APP_DOMAIN = 'YOUR_PARLE_APP_DOMAIN';

// Term of Service Url
// Example: https://www.google.com
var TOS_URL = 'YOUR_TOS_URL';
// Privacy Policy Url
// Example: https://www.google.com
var PRIVACY_POLICY_URL = 'YOUR_PRIVACY_POLICY_URL';
