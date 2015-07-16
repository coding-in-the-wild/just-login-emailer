var test = require('tape')
var EventEmitter = require('events').EventEmitter
var LoginMailer = require('../index.js')
var xtend = require('xtend')

var transportOpts = require('./transport-options.json')
var mailOpts = {
	from: transportOpts.auth.user,
	subject: 'Login to this site!'
}
var authRequest = {
	'token': 'totallyNotFakeLoginToken',
	'contactAddress': 'josephdykstra@gmail.com'
}

function createHtmlEmail(loginToken) {
	var url = 'http://localhost:9999/magical-login?token=' + loginToken
	var link = 'here!'.link(url)
	return '<div>You should totally log in!<br>Click ' + link + '</div>'
}

test('test for email sending', function (t) {
	t.plan(2)

	var fakeCore = new EventEmitter()

	LoginMailer(fakeCore, createHtmlEmail, transportOpts, mailOpts, function (err, info) {
		t.notOk(err, 'no error')
		t.ok(info, 'got response')
		t.end()
	})

	fakeCore.emit('authentication initiated', authRequest)
})
