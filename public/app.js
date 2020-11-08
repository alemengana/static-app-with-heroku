/**
 * @return {!Object} The FirebaseUI config.
 */
function getUiConfig() {
	return {
		// Url to redirect to after a successful sign-in.
		'signInSuccessUrl': PARLE_APP_URL,
		'callbacks': {
			// Called when the user has been successfully signed in.
			'signInSuccessWithAuthResult': function (authResult, redirectUrl) {

				var isNewUser = true;
				var isEmailVerified = false;

				if (authResult.user) {
					handleSignedInUser(authResult.user);
					isEmailVerified = authResult.user.emailVerified;
				}
				if (authResult.additionalUserInfo) {
					isNewUser = authResult.additionalUserInfo.isNewUser;
				}

				if (isNewUser && !isEmailVerified) {
					// Verify email - send email
					authResult.user.sendEmailVerification().then(function () {
						// Email sent.
					}).catch(function (error) {
						// An error happened.
					});
				}

				// No Redirect
				return false;
			}
		},
		// Opens IDP Providers sign-in flow in a popup.
		'signInFlow': 'popup',
		'signInOptions': [
			// Remove the providers you don't need for your app.
			{
				provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
				// Required to enable ID token credentials for this provider.
				clientId: CLIENT_ID
			},
			{
				provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
				// Whether the display name should be displayed in Sign Up page.
				requireDisplayName: true,
				signInMethod: 'password'
			}
		],
		// Terms of service url.
		'tosUrl': TOS_URL,
		// Privacy policy url.
		'privacyPolicyUrl': PRIVACY_POLICY_URL,
		'credentialHelper': CLIENT_ID ?
			firebaseui.auth.CredentialHelper.GOOGLE_YOLO :
			firebaseui.auth.CredentialHelper.NONE
	};
}

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// Disable auto-sign in.
ui.disableAutoSignIn();

/**
 * Displays the UI for a signed in user.
 * @param {!firebase.User} user
 */
var handleSignedInUser = function (user) {
	document.getElementById('loading').style.display = 'block';
	document.getElementById('user-signed-out').style.display = 'none';

	if (logoutIsNeeded()) {
		location.replace(location.pathname);
		firebase.auth().signOut();
	} else {
		user.getIdTokenResult(/* forceRefresh */ true).then(function (idTokenResult) {
			// Update or add token data from localStorage - new time and new token
			localStorage.setItem('parleAuthData', JSON.stringify({ expirationTime: idTokenResult.expirationTime, token: idTokenResult.token }));
			// Cookie
			var cookieName = 'parleAuthData';
			var cookieValue = JSON.stringify({ expirationTime: idTokenResult.expirationTime, token: idTokenResult.token });
			var date = new Date();
			date.setMonth(date.getMonth() + 12);
			document.cookie = `${cookieName}=${cookieValue};expires=${date};domain=${PARLE_APP_DOMAIN};path=/`;

			// Redirect to parle app
			window.location.assign(PARLE_APP_URL);
		}).catch(function (error) {
			console.log(error);
		});
	}
};

/**
 * Displays the UI for a signed out user.
 */
var handleSignedOutUser = function () {
	document.getElementById('loading').style.display = 'none';

	// Clear token data from localStorage
	localStorage.removeItem('parleAuthData');
	// Delete cookie data for parle auth
	var cookieName = 'parleAuthData';
	document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=${PARLE_APP_DOMAIN};path=/`;

	document.getElementById('user-signed-out').style.display = 'block';
	ui.start('#firebaseui-container', getUiConfig());
};

// Listen to change in auth state so it displays the correct UI for when
// the user is signed in or not.
firebase.auth().onAuthStateChanged(function (user) {
	document.getElementById('loaded').style.display = 'block';
	user ? handleSignedInUser(user) : handleSignedOutUser();
});

/**
 * Initializes the app.
 */
var initApp = function () {
	// Reset the inline widget so the config changes are reflected.
	ui.reset();
	ui.start('#firebaseui-container', getUiConfig());
};
window.addEventListener('load', initApp);
