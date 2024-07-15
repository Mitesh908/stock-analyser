const mongoose = require('mongoose');

// DB_URL = 'mongodb+srv://miteshgautam85244:BOu1VU4mNP0mAru6@cluster0.6yr3wix.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
DB_URL = 'mongodb+srv://mitesh908:mitesh908@cluster0.6yr3wix.mongodb.net/stocks?retryWrites=true&w=majority&appName=Cluster0';

const connectToDB = async () => {

	try {
		const connection = await mongoose.connect(DB_URL);
		console.log(`connected to db ${connection.connection.host}`)
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
}

module.exports = connectToDB();
