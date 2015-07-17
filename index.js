var EventEmitter = require('events').EventEmitter
var nodemailer = require('nodemailer')
var xtend = require('xtend')

module.exports = function loginMailer(core, options) {
	if (!options || typeof options !== 'object') throw new Error('Expected options object')
	if (typeof options.createHtmlEmail !== 'function') throw new Error('Expected options.createHtmlEmail')
	if (typeof options.transport !== 'object') throw new Error('Expected options.transport')

	var defaultFrom = options.transport.auth && options.transport.auth.user
	var defaultMailOpts = xtend({
		from: defaultFrom,
		sender: defaultFrom,
		subject: 'Login'
	}, options.mail || {})

	var emitter = new EventEmitter()
	var transport = nodemailer.createTransport(options.transport)

	core.on('authentication initiated', function (loginRequest) {
		var mailOpts = xtend(defaultMailOpts, {
			to: loginRequest.contactAddress,
			html: options.createHtmlEmail(loginRequest.token)
		})
		transport.sendMail(mailOpts, function (err, info) {
			if (err) {
				emitter.emit('error', err)
			} else {
				emitter.emit('data', info)
			}
		})
	})

	return emitter
}
