var test = require('tape')
var EventEmitter = require('events').EventEmitter
var LoginMailer = require('../index.js')
var xtend = require('xtend')

var transportOpts = require('../../config.json').justLogin.email
var authRequest = {
	token: 'totallyNotFakeLoginToken',
	contactAddress: 'josephdykstra@gmail.com'
}

test('test for email sending', function (t) {
	t.plan(2)

	var fakeCore = new EventEmitter()
	var options = {
		createHtmlEmail: String,
		transport: {}, //transportOpts,
		mail: { subject: 'Login to this site!' }
	}

	LoginMailer(fakeCore, options)

	fakeCore.emit('authentication initiated', authRequest)
})
