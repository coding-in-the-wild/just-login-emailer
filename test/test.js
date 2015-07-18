var test = require('tape')
var EventEmitter = require('events').EventEmitter
var LoginMailer = require('../index.js')
var xtend = require('xtend')
var numEmailsSent = require('./helpers/num-emails-sent.js')
var numEmailsReceived = require('./helpers/num-emails-received.js')

var transportOpts = require('../../config.json').justLogin.email
var localPart = Math.random().toString().slice(2)
var startSent = 0
var startReceived = 0

test('get baseline sent', function (t) {
	t.plan(2)
	numEmailsSent(function (err, numSent) {
		t.notOk(err, err ? err.message : 'no error')
		t.equal(typeof numSent, 'number', 'got the number ' + numSent)
		startSent = numSent
		t.end()
	})
})

test('get baseline received', function (t) {
	t.plan(2)
	numEmailsReceived(localPart, function (err, numReceived) {
		t.notOk(err, err ? err.message : 'no error')
		t.equal(typeof numReceived, 'number', 'got the number ' + numReceived)
		startReceived = numRecieved
		t.end()
	})
})


test('test for email sending', function (t) {
	t.plan(4)

	var core = new EventEmitter()

	var emitter = LoginMailer(core, {
		createHtmlEmail: String,
		transport: transportOpts,
		mail: { subject: 'Login to this site!' }
	})

	var email = localPart + '@mailinator.com'
	t.pass('Sending an email to ' + email)
	core.emit('authentication initiated', { token: ':P', contactAddress: email })

	emitter.on('error', function (err) {
		t.fail(err.message)
		t.end()
	})
	emitter.on('data', function (data) {
		t.equal(data.accepted.length, 1, 'one successful email sent')
		t.equal(data.rejected.length, 0, 'no unsuccessful emails sent')
		t.equal(data.response[0], '2', '2xx response')
		t.end()
	})
})

test('wait a bit', function (t) {
	t.plan(1)
	setTimeout(function () {
		t.pass('waited')
		t.end()
	}, 1000)
})

test('correct number of emails sent', function (t) {
	t.plan(3)
	numEmailsSent(function (err, numSent) {
		t.notOk(err, err ? err.message : 'no error')
		t.equal(typeof numSent, 'number', 'got the number ' + numSent)
		var msg = 'started with ' + startSent + ', have ' + numSent
		t.equal(startSent + 1, numSent, msg)
		t.end()
	})
})

test('wait a bit MORE', function (t) {
	t.plan(1)
	setTimeout(function () {
		t.pass('waited')
		t.end()
	}, 2500)
})

test('correct number of emails received', function (t) {
	t.plan(3)
	numEmailsReceived(localPart, function (err, numReceived) {
		t.notOk(err, err ? err.message : 'no error')
		t.equal(typeof numReceived, 'number', 'got the number ' + numReceived)
		var msg = 'started with ' + startReceived + ', have ' + numReceived
		t.equal(startReceived + 1, numReceived, msg)
		t.end()
	})
})
