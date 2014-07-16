var EventEmitter = require('events').EventEmitter
var LoginMailer = require('./index.js')
var Ractive = require('ractive')
var Wellknown = require('nodemailer-wellknown') //host, port, secure

var emailAddress = 'josephdykstra@gmail.com'
var transportOptions = xtend(
	Wellknown('gmail'),
	{
		auth: {
			user: 'justloginexample@gmail.com',
			pass: 'justloginexamplegmail'
		}
	}
)

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
	from: 'justloginexample@gmail.com',
	//replyTo: 'justloginexample@gmail.com', //dont need?
	subject: 'Login to this site!'
}

LoginMailer(fakeCore, createHtmlEmail, transportOptions, defaultMailOptions)

fakeCore.emit('authentication initiated', {
	token: 'totallyNotFakeLoginToken',
	contactAddress: emailAddress
})
