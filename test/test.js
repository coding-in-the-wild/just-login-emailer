var test = require('tap').test
var EventEmitter = require('events').EventEmitter
var LoginMailer = require('../index.js')

var emailAddress = 'joseph'+'dykstra@gmail.com' //Send the email to whom...
var password = require('../../config.json').justLogin.email.auth.pass //password for sending emails
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

	var fakeCore = new EventEmitter()

	function createHtmlEmail(loginToken) {
		return '<div>You should totally log in!<br />' +
			'Click <a href="http://localhost:9999/magical-login?token=' +
			loginToken + '">here!</a></div>'
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
