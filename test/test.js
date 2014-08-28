var test = require('tap').test
var EventEmitter = require('events').EventEmitter
var LoginMailer = require('../index.js')
var xtend = require('xtend')
var Ractive = require('ractive')
var Wellknown = require('nodemailer-wellknown') //host, port, secure

var emailAddress = 'joseph'+'dykstra@gmail.com' //Send the email to whom...
var password = require('../../#sensitive-info/just-login-email-opts.js') //password for sending emails
var transportOptions = {
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: 'justloginexample@gmail.com',
		pass: password
	}
}

test('test for email sending', function (t) {
	t.plan(2)

	var fakeCore = Object.create(new EventEmitter())

	var ractiveTemplate = Ractive.parse('<div>You should totally log in!<br />'
		+ 'Click <a href="http://localhost:9999/magical-login?token={{token}}">here!</a></div>')
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
		subject: 'Login to this site!'
	}

	LoginMailer(fakeCore, createHtmlEmail, transportOptions, defaultMailOptions, function (err, info) {
		t.notOk(err, "no error")
		t.ok(info, "got response")
		t.end()
	})

	fakeCore.emit('authentication initiated', {
		token: 'totallyNotFakeLoginToken',
		contactAddress: emailAddress
	})
})
