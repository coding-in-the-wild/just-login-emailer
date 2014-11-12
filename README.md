just-login-emailer
==================

#Install

With [npm](http://npmjs.org) do: 
	
	npm install just-login-emailer

#Require

Require in src:

```js
var justLoginEmailer = require('just-login-emailer')
```

#Usage

##justLoginEmailer(emitter, createHtmlEmail, transportOptions, defaultMailOptions, callback)

- `emitter` is an emitter that emits the event, `authentication initiated`, like the just-login-core does.
- `createHtmlEmail` is a function with the argument `token` and it returns an HTML email
	- `token` is the token string given in the `authentication initiated` event.
- `transportOptions` is the object given to [`nodemailer.createTransport()`][nm-ct]. Needs these properties: `host`, `port`, `secure`, and `auth`. `auth` needs these properties: `user`, `pass`
- `defaultMailOptions` is an object with these properties: `from`, `to`, `subject`, `text`, `html`, etc. (Needs `from` and `subject`. `from` must be an email address. See [nodemailer/Email Message Fields][nm-emf] for more information. Please note that the `to` and `html` properties will be overwritten.)
- `callback` is the callback function with the arguments `err` and `info`.
	- `err` is an error object if sending failed, and `null` if it was successful.
	- `info` is an object. See [nodemailer/Sending mail][nm-sm] for details on `info`. (You probably don't need this object.)

#Example

Usage with the [Just Login Core][core]

```js
var justLoginEmailer = require('just-login-emailer')
var JustLoginCore = require('just-login-core')
var level = require('level')
var escapeHtml = require('escape-html')

var db = level('./databases/core')
var justLoginCore = JustLoginCore(db)

setTimeout(function () {
	justLoginCore.beginAuthentication('session id', 'user@example.com', function () {})
}, 5000)

function createHtmlEmail(token) {
	return escapeHtml(
		'<html><body>'
		+ '<h1>Login Now!</h1>'
		+ '<p>If you do want to log in, click <a href="http://example.com/login?token=' + token + '">right here</a>!</p>'
		+ '<p>If not, ignore this email!</p>'
		+ '</body></html>'
	)
}

var transportOptions = { //if using gmail's sending server
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: "sending_address@gmail.com",
		pass: "whatever the password is"
	}
}

var defaultMailOptions = {
	from: 'sending_address@gmail.com',
	subject: 'login now'
}

justLoginEmailer(emitter, htmlEmail, transportOptions, defaultMailOptions, function (err, info) {
	if (err) console.error(err)
})
```


[nm-emf]: https://github.com/andris9/Nodemailer#e-mail-message-fields
[nm-sm]: https://github.com/andris9/Nodemailer#sending-mail
[nm-ct]: https://github.com/andris9/Nodemailer#tldr-usage-example
[core]: http://github.com/coding-in-the-wild/just-login-core
