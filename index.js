var nodemailer = require("nodemailer")
var extend = require('extend')

module.exports = function LoginMailer(justLoginCore, createHtmlEmail, transportOptions, defaultMailOptions, transportType) {
	var transport = nodemailer.createTransport(transportType || 'SMTP', transportOptions)

	justLoginCore.on('authentication initiated', function(loginRequest) {
		transport.sendMail(extend({
			to: loginRequest.contactAddress,
			html: createHtmlEmail(loginRequest.token)
		}, defaultMailOptions), function(err, response) {
			if (err) {
				console.log("ERRRROOOOOOR", err.message)
			} else {
				console.log(response)
			}
		})
	})
}
