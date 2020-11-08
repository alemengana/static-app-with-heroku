const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
const express = require('express');

const sampleConfigPath = __dirname + '/public/sample-config.js';
const configPath = __dirname + '/public/config.js';

fs.copyFile(sampleConfigPath, configPath, (err) => {
	if (err) throw err;
	console.log('sample-config.js was copied to config.js');
	console.log('-------------------------------------------');

	// Replace content for config.js
	fs.readFile(configPath, 'utf8', function (err, data) {
		if (err) throw err;

		const string1 = data.replace(/YOUR_API_KEY/g, process.env.YOUR_API_KEY);
		const string2 = string1.replace(/project-id.firebaseapp.com/g, process.env.PARLE_AUTH_DOMAIN);
		const string3 = string2.replace(/https:\/\/project-id.firebaseio.com/g, process.env.PARLE_DATABASE_URL);
		const string4 = string3.replace(/project-id.appspot.com/g, process.env.PARLE_STORAGE_BUCKET);
		const string5 = string4.replace(/YOUR_OAUTH_CLIENT_ID/g, process.env.YOUR_OAUTH_CLIENT_ID);
		const string6 = string5.replace(/YOUR_PARLE_APP_URL/g, process.env.YOUR_PARLE_APP_URL);
		const string7 = string6.replace(/YOUR_PARLE_APP_DOMAIN/g, process.env.YOUR_PARLE_APP_DOMAIN);
		const string8 = string7.replace(/YOUR_TOS_URL/g, process.env.YOUR_TOS_URL);
		const string9 = string8.replace(/YOUR_PRIVACY_POLICY_URL/g, process.env.YOUR_PRIVACY_POLICY_URL);

		console.log(string9);
		console.log('-------------------------------------');
		console.log('config.js was modified');

		fs.writeFile(configPath, string9, 'utf8', function (err) {
			if (err) throw err;

			// Init Express server
			const app = express();
			app.use(express.static('public'));
			app.get('/', (req, res) => {
				res.sendFile('index.html', { root: __dirname + '/public/' });
			});
			app.listen(process.env.PORT || 5000, () => {
				console.log('Server running...');
				console.log('If running locally, open: http://localhost:5000');
			});
		});
	});
});
