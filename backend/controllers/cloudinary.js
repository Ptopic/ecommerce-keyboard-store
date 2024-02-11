const cloudinary = require('cloudinary');

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_SECRET,
});

exports.uploadToCloudinary = (path, folder) => {
	return cloudinary.v2.uploader
		.upload(path, {
			folder,
		})
		.then((data) => {
			return { url: data.url, public_id: data.public_id };
		})
		.catch((error) => {
			console.log(error);
		});
};

exports.removeFromCloudinary = async (public_id) => {
	await cloudinary.v2.uploader.destroy(public_id, (result, error) => {
		console.log(result, error);
	});
};
