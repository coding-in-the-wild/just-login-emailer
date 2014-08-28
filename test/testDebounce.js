var test = require('tap').test
var EventEmitter = require('events').EventEmitter
var loginMailer = require('../index.js')

/*
The 'authentication initiated' event is caught by the 'loginMailer', which in
turn will emit 'sent email' with true or false, of whether or not it sent it.
This file will catch the 'sent email' event, and see if it expected the status
of whether or not the email sent.
*/

test('test for email sending', function (t) {
	t.plan(5)

	var emitter = Object.create(new EventEmitter())
	var expected = true

	loginMailer(emitter, function (a) {return a}, {}, {}, function (err, info) {})

	var sendEmail = function (expect, seconds, stop) {
		setTimeout(function () {
			expected = expect
			emitter.emit('authentication initiated', { 
				token: 'totallyNotFakeLoginToken',
				contactAddress: 'ex@mp.le'
			})
			if (stop) {
				t.end()
			}
		}, seconds*1000)
	}

	emitter.on('sent email', function (sent) {
		t.equal(sent, expected, 'wanted:'+expected+', found:'+sent)
	})

	sendEmail(true,  0)        //should allow an email right away
	sendEmail(false, 2)        //should block this one, since it is within 5 seconds of previous
	sendEmail(true,  7)        //should allow this one, since it is not within 5 seconds of previous
	sendEmail(false, 15)       //should block this one, since it is within 10 seconds of previous
	sendEmail(true,  18, true) //should allow this one, since it is not within 10 seconds of previous
})
