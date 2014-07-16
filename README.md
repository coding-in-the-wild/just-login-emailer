just-login-emailer
==================

#Install and Require

With npm do: 
	
	npm install just-login-emailer

Require in src:

	var loginMailer = require('just-login-emailer')

##loginMailer(emitter, createHtmlEmail, transportOptions, defaultMailOptions, callback)

- `emitter` is an emitter that emits the event, `authentication initiated`, like the just-login-core does.
- `createHtmlEmail` is a function with the argument `token` and it returns an HTML email
	- `token` is the token given in the `authentication initiated` event.
- `transportOptions` is the object given to [`nodemailer.createTransport()`](https://github.com/andris9/Nodemailer#tldr-usage-example)
- `defaultMailOptions` is an object with these settable properties: `from`, `to`, `subject`, `text`, `html`, etc. (See [nodemailer/Email Message Properties](https://github.com/andris9/Nodemailer#e-mail-message-fields) for more information. Please note that the `to` and `html` properties will be overwritten.)
- `callback` is the callback function with the arguments `err` and `info`.
	- `err` is the error object if sending failed.
	- `info` is an object. See [nodemailer/Sending mail](https://github.com/andris9/Nodemailer#sending-mail) for details on `info`.

#notes

If you use browserify, it might throw an error saying: `Error: module "iconv" not found from "[LONG PATH HERE]"`.

If that happens, browse to your `just-login-example` folder and navigate to `\node_modules\just-login-emailer\node_modules\nodemailer\node_modules\mailcomposer\node_modules\mimelib\node_modules\encoding\lib\encoding.js`. Comment out line 7, between the `try` and `catch` statements, should look like `Iconv = require('iconv').Iconv;`.