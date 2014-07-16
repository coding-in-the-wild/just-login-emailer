just-login-emailer
==================

#notes

If you use browserify, it might throw an error saying: `Error: module "iconv" not found from "[LONG PATH HERE]"`.

If that happens, browse to your `just-login-example` folder and navigate to `\node_modules\just-login-emailer\node_modules\nodemailer\node_modules\mailcomposer\node_modules\mimelib\node_modules\encoding\lib\encoding.js`. Comment out line 7, between the `try` and `catch` statements, should look like `Iconv = require('iconv').Iconv;`.