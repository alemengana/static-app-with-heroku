/**
 * Common methods.
 */

/**
 * Examples using location to redirect and replace url
 * location.replace(location.pathname + '#recaptcha=normal&emailSignInMethod=password');
 * window.location.assign('/widget#recaptcha=normal&emailSignInMethod=password');
 */

/**
 * @return {boolean} If logout is needed.
 */
function logoutIsNeeded() {
	var config = parseQueryString(location.hash);
	return config['logout'] === 'logout';
}

/**
 * @param {string} queryString The full query string.
 * @return {!Object<string, string>} The parsed query parameters.
 */
function parseQueryString(queryString) {
	// Remove first character if it is ? or #.
	// Example: http://localhost:5000/#recaptcha=normal&emailSignInMethod=password
	if (queryString.length &&
		(queryString.charAt(0) == '#' || queryString.charAt(0) == '?')) {
		queryString = queryString.substring(1);
	}
	var config = {};
	var pairs = queryString.split('&');
	for (var i = 0; i < pairs.length; i++) {
		var pair = pairs[i].split('=');
		if (pair.length == 2) {
			config[pair[0]] = pair[1];
		}
	}
	return config;
}
