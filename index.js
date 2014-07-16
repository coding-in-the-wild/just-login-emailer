var nodemailer = require("nodemailer")
var xtend = require('xtend')

module.exports = function LoginMailer(emitter, createHtmlEmail, transportOptions, defaultMailOptions) {
	var transport = nodemailer.createTransport(transportOptions)

	emitter.on('authentication initiated', function(loginRequest) {
		transport.sendMail(xtend({
			to: loginRequest.contactAddress,
			html: createHtmlEmail(loginRequest.token)
		}, defaultMailOptions), function(err, response) {
			if (err) {
				console.log("Email Error:", err.message)
			} else {
				console.log(response)
			}
		})
	})
}
