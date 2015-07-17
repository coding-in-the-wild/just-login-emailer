var test = require('tape')
var EventEmitter = require('events').EventEmitter
var LoginMailer = require('../index.js')
var xtend = require('xtend')
var getEmailsSentToday = require('./helpers/emails-sent-today.js')

var transportOpts = require('../../config.json').justLogin.email
var random = Math.random().toString().slice(2)
var authRequest = {
	token: random,
	contactAddress: 'josephdykstra@gmail.com'
}
var emailsSentToday = 0

test('get baseline', function (t) {
	t.plan(2)
	
	getEmailsSentToday(t, function (err, num) {
		t.notOk(err, err ? err.message : 'no error')
		t.ok(num, 'got the number ' + num)
		emailsSentToday = num
		t.end()
	})
})

test('test for email sending', function (t) {
	t.plan(3)

	var core = new EventEmitter()

	var emitter = LoginMailer(core, {
		createHtmlEmail: String,
		transport: transportOpts,
		mail: { subject: 'Login to this site!' }
	})

	core.emit('authentication initiated', authRequest)
	
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

test('email was actually sent somewheres', function (t) {
	t.plan(2)
	
	getEmailsSentToday(t, function (err, num) {
		t.notOk(err, err ? err.message : 'no error')
		t.equal(emailsSentToday + 1, num)
		t.end()
	})
})
