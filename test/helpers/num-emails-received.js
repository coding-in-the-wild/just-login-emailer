var got = require('got')
var mailinatorUrl = require('./mailinator-url.json')

module.exports = function numEmailsReceived(localPart, cb) {
	got(mailinatorUrl + localPart, function (err, data) {
		var messages = JSON.parse(data).messages
		var num = messages.length
		cb(err, num)
	})
}
