// Format prices display
export const formatPriceDisplay = (price) => {
	// Convert price to string
	price = String(price);

	// Split price by .
	let splittedPrice = price.split('.');
	if (splittedPrice.length > 1) {
		// if length is 1 (. then digit)
		// just add 0 to end
		// Replace . with ,
		if (splittedPrice[1].length == 1) {
			splittedPrice[1] += '0';
		}
		// If length is 2 dont add anything
		// Replace . with ,
		return splittedPrice.join(',');
	} else {
		// of length is 0
		// Add ,00 to end
		splittedPrice[0] += ',00';
		return splittedPrice[0];
	}
};
