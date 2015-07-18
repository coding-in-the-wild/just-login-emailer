var got = require('got')
var statsUrl = require('./stats-url.json')

module.exports = function numEmailsSent(cb) {
	got(statsUrl, function (err, data) {
		var obj = JSON.parse(data)
		var num = obj.items[0].total_count
		cb(err, num)
	})
}
