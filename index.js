var nodemailer = require("nodemailer")
var xtend = require('xtend')

module.exports = function loginMailer(emitter, createHtmlEmail, transportOptions, defaultMailOptions, callback) {
	var transport = nodemailer.createTransport(transportOptions)

	var allowEmailToBeSent = true
	var delayTimes = [0, 5, 10, 15, 30, 180] //seconds
	var delayTimeIndex = 0
	var lockTime = process.uptime()

	emitter.on('authentication initiated', function (loginRequest) { //don't use timers plz. they make tests hang.
		if (process.uptime() >= lockTime + delayTimes[delayTimeIndex]) {
			//console.log('pass -> now:'+process.uptime()+', waitUntil:'+(lockTime+delayTimes[delayTimeIndex]))
			if (delayTimeIndex < delayTimes.length-1) {
				delayTimeIndex++
			}
			lockTime = process.uptime()

			transport.sendMail(xtend({
				to: loginRequest.contactAddress,
				html: createHtmlEmail(loginRequest.token)
			}, defaultMailOptions), callback)
			emitter.emit('sent email', true)
		} else {
			//console.log('fail -> now:'+process.uptime()+', waitUntil:'+(lockTime+delayTimes[delayTimeIndex]))
			emitter.emit('sent email', false)
		}
	})
}
