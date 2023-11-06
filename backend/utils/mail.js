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

const generateReceipt = (receiptUrl, orderId, amount, products) => {
	let shipping;
	if (amount > 20) {
		shipping = 0;
	} else {
		shipping = 3;
	}

	// Get current date and time

	const date = new Date();

	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();

	const dateString = `${day}.${month}.${year}`;
	var today = new Date();
	today.toLocaleString('de-DE', {
		hour: '2-digit',
		hour12: false,
		timeZone: 'Europe/Zagreb',
	});
	var todayHour = Number(today.getHours() + 2);

	if (todayHour > 24) {
		todayHour = todayHour - 24;
	}

	if (today.getMinutes() < 10) {
		var todayTime = todayHour + ':' + '0' + today.getMinutes();
	} else {
		var todayTime = todayHour + ':' + today.getMinutes();
	}

	var newHour = Number(today.getHours()) + 2;

	if (newHour > 24) {
		newHour = newHour - 24;
	}

	if (today.getMinutes() < 10) {
		var newTime = newHour + ':' + '0' + today.getMinutes();
	} else {
		var newTime = newHour + ':' + today.getMinutes();
	}

	newTime.toLocaleString('de-DE', {
		hour: '2-digit',
		hour12: false,
		timeZone: 'Europe/Zagreb',
	});

	let productsHtml = products.map((product) => {
		return `<tr>
      <td
        rowspan="2"
        width="70px"
        align="center"
        valign="center"
        style="padding: 5px 15px 0px 0px"
      >
        <img
          src="${product.originalProduct.image[0]}"
          alt=""
          style="width: 70px; height: 70px; object-fit: cover"
        />
      </td>
      <td align="left" valign="top" style="padding: 15px 0px 5px 0px">
        <p style="padding: 0 0 10px 0; margin: 0">
          ${product.originalProduct.title}
        </p>
        <a href=${
					'http://192.168.1.200:3000/product/' + product.productId
				} style="color: #000000">Informacije o proizvodu</a>
      </td>
      <td rowspan="2" align="right" valign="center" width="80px">
        <h3 class="price" style="padding: 0; margin: 0">${product.price} €</h3>
      </td>
    </tr>
    <tr>
      <td align="left" valign="top" style="padding: 5px 0px 15px 0px">
        ${product.quantity} kom ${
			product.color ? `- Boja: ${product.color}` : ''
		}
      </td>
    </tr>\n`;
	});

	console.log(productsHtml);

	const templateLiterals = [];

	for (var i = 0; i < products.length; i++) {
		templateLiterals.push(
			`
      <tr>
      <td
        rowspan="2"
        width="70px"
        align="center"
        valign="center"
        style="padding: 5px 15px 0px 0px"
      >
        <img
          src="${products[i].originalProduct.image[0]}"
          alt=""
          style="width: 70px; height: 70px; object-fit: cover"
        />
      </td>
      <td align="left" valign="top" style="padding: 15px 0px 5px 0px">
        <p style="padding: 0 0 10px 0; margin: 0">
          ${products[i].originalProduct.title}
        </p>
        <a href=${
					process.env.CLIENT_URL + '/product/' + products[i].productId
				} style="color: #000000">Informacije o proizvodu</a>
      </td>
      <td rowspan="2" align="right" valign="center" width="80px">
        <h3 class="price" style="padding: 0; margin: 0">${
					products[i].price
				} €</h3>
      </td>
    </tr>
    <tr>
      <td align="left" valign="top" style="padding: 5px 0px 15px 0px">
        ${products[i].quantity} kom ${
				products[i].color ? `- Boja: ${products[i].color}` : ''
			}
      </td>
    </tr>`
		);
	}

	console.log(templateLiterals);

	return (
		`<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      <title>Reciept</title>
      <style type="text/css" rel="stylesheet"></style>
    </head>
    <body
      style="
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        font-size: 14px;
        font-family: 'Poppins', sans-serif;
      "
    >
      <table width="95%" class="receipt-header" height="30" align="center">
        <tr>
          <td rowspan="2">
            <a href="${process.env.CLIENT_URL}">
              <img
                src="https://ucarecdn.com/e43274d6-1212-4150-8c20-b6236a281193/logo.png"
                alt=""
                style="width: 150px"
              />
            </a>
            <!-- <h1 style="color: #e81123; margin: 0; padding: 0">Switchy</h1> -->
          </td>
          <td align="right">Broj narudžbe: <span>${orderId}</span></td>
        </tr>
        <tr>
          <td colspan="2" align="right">
            Napravljena: <span>${dateString}. ${newTime}</span>
          </td>
        </tr>
      </table>
      <table align="center" width="95%">
        <tr style="height: 150px">
          <td>
            <h1 style="color: #e81123; margin: 0; padding: 0">
              Thank you for your Order
            </h1>
          </td>
        </tr>
        <tr style="height: 60px">
          <td style="padding: 0 0 40px 0">
            <a
              href="${process.env.CLIENT_URL}/order/${orderId}"
              style="
                background-color: #e81123;
                color: white;
                padding: 10px;
                border-radius: 12px;
                font-size: 16px;
              "
              >View your order</a
            >
          </td>
        </tr>
        <tr>
          <td>
            <div class="sazetak" style="border-bottom: 2px solid #e81123">
              <h3 style="margin: 0; padding: 0">Sažetak narudžbe</h3>
            </div>
          </td>
        </tr>
      </table>

      <table
        width="95%"
        style="
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 2px solid #e81123;
          margin-bottom: 2rem;
        "
        align="center"
      >
    ` +
		templateLiterals +
		`
      </table>
  
      <table
        align="center"
        width="95%"
        style="
          padding-bottom: 2rem;
          border-bottom: 2px solid #e81123;
          margin-bottom: 2rem;
        "
      >
        <tr>
          <td>Dostava - DPD</td>
          <td align="right">${shipping} €</td>
        </tr>
        <tr>
          <td>Kupon</td>
          <td align="right">0 €</td>
        </tr>
        <tr>
          <td>Način plaćanja</td>
          <td align="right">Kartica</td>
        </tr>
      </table>
      <table align="center" width="95%" style="margin-bottom: 2rem">
        <tr>
          <td>Ukupna cijena s PDV-om</td>
          <td align="right">${amount} €</td>
        </tr>
      </table>
  
      <table align="center" width="95%">
        <tr>
          <td><a href="${receiptUrl}">PDF dokument Vaše narudžbe</a></td>
        </tr>
      </table>
    </body>
  </html>
  
  `
	);
};

module.exports = {
	mailTransport,
	generatePasswordResetTemplate,
	generateReceipt,
};
