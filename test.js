var EventEmitter = require('events').EventEmitter
var LoginMailer = require('./index.js')
var Ractive = require('ractive')

var emailAddress = ''
var emailSendingOptions = {
	host: 'mail.fiddlebutt.com',
	auth: {
		user: 'login@fiddlebutt.com',
		pass: ''
	}
}

var fakeCore = Object.create(new EventEmitter())

var ractiveTemplate = Ractive.parse('<div>You should totally log in!<br />'
	+ 'Click <a href="http://somesite.com/login?secretCode={{token}}">here!</a></div>')

function createHtmlEmail(loginToken) {
	return new Ractive({
		el: '',
		template: ractiveTemplate,
		data: {
			token: loginToken
		}
	}).toHTML()
}

var defaultMailOptions = {
	from: 'login@fiddlebutt.com',
	replyTo: 'no-reply@fiddlebutt.com',
	subject: 'Login to this site!'
}

LoginMailer(fakeCore, createHtmlEmail, emailSendingOptions, defaultMailOptions)

fakeCore.emit('authentication initiated', {
	token: 'totallyNotFakeLoginToken',
	contactAddress: emailAddress
})
