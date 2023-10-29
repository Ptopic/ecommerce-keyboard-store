const nodemailer = require('nodemailer');

const mailTransport = () =>
	nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: process.env.GMAIL_EMAIL,
			pass: process.env.GMAIL_PASSWORD,
		},
	});

const generatePasswordResetTemplate = (user, url) => {
	return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Reciept</title>
      <style type="text/css" rel="stylesheet">
        h1 {
          color: #e81123;
        }
        
        .container {
          padding: 30px 0;
        }
        
        a {
          text-decoration: none;
          color: white;
          background-color: #e81123;
          padding: 10px;
          margin-top: 25px;
        }
      </style>
    </head>
    <body>
      <h1>Hi, ${user}.</h1>
      <div class="container">
        <h2>Reset your password.</h2>
      
        <p>Here is your password reset link.</p>
        <a href=${url}>Reset password</a>
      </div>
    </body>
  </html>
       
        `;
};

const generateReceipt = () => {
	return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Reciept</title>
      <style type="text/css" rel="stylesheet">
        h1 {
          color: #e81123;
        }
      </style>
    </head>
    <body>
      <h1>Thank you for your Order</h1>
      <h2>Here is your receipt.</h2>
    </body>
  </html>
  `;
};

module.exports = {
	mailTransport,
	generatePasswordResetTemplate,
	generateReceipt,
};
