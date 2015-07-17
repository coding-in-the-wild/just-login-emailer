just-login-emailer
==================

Sends emails to folks who want to log in!

# Example

Usage with the [Just Login Core](http://github.com/coding-in-the-wild/just-login-core)

```js
var justLoginEmailer = require('just-login-emailer')
var JustLoginCore = require('just-login-core')
var db = require('level')('./databases/core')
var core = JustLoginCore(db)

setTimeout(function () {
	core.beginAuthentication('session id', 'user@example.com')
}, 5000)

function createHtmlEmail(token) {
	return 'To login, <a href="http://example.com/login?token=' + token + '">click here</a>!'
}

var transportOpts = {
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: 'sending_address@gmail.com',
		pass: 'whatever the password is'
	}
}

justLoginEmailer(core, {
	createHtmlEmail: createHtmlEmail,
	transport: transportOpts
})
```

# Usage

```js
var justLoginEmailer = require('just-login-emailer')
```

## `var emitter = justLoginEmailer(core, options)`

### `core`

An emitter that emits the event, `authentication initiated`, usually a [`just-login-core`](http://github.com/coding-in-the-wild/just-login-core) object.

#### `options.createHtmlEmail`

A function that is passed a `token` and returns an HTML email message.

`token` string, e.g. `'b02ceecc-2c81-11e5-89e4-83f49df54746'`

```js
function createHtmlEmail(token) {
	return '<a href="http://example.com/login/' + token + '">Click to Login!</a>'
}
```

#### `options.transport`

A [Nodemailer transport object](https://github.com/andris9/nodemailer-smtp-transport#usage). The following fields are suggested.

```js
{
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: 'sender@gmail.com',
		pass:'password123'
	}
}
```

#### `options.mail` (optional)

An optional object with the following properties:

- `from` string, e.g. `'sender@gmail.com'`, defaults to `options.transport.auth.user` if it exists
- `subject` string, e.g. `'Log in to this site'`, defaults to `'Login'`
- See [full list of mail options](https://github.com/andris9/Nodemailer#e-mail-message-fields). (`to` and `html` properties are ignored.)

```js
{
	from: 'sender@gmail.com',
	subject: 'Log in to example.com!'
}
```

### `emitter`

An emitter that sends an event on the status of an email.

- `emitter.emit('error', err)` on an error
- `emitter.emit('data', info)` if it was successful. See [full specs of info object](https://github.com/andris9/Nodemailer#sending-mail).

```js
var emitter = JustLoginEmailer(core, options)

emitter.on('error', function (err) {
	throw err
})

emitter.on('data', function (info) {
	console.log(info.response)
})
```

# Install

With [npm](http://nodejs.org/download) do:

	npm install just-login-emailer

# License

[VOL](http://veryopenlicense.com)
