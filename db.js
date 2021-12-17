const { MongoClient, Db } = require("mongodb");
const connectionString = process.env.DB_URL;
const client = new MongoClient(connectionString, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
let dbConnection;

module.exports = {
	connectToServer: (callback) => {
		client.connect((err, db) => {
			if (err || !db)
				return callback(err);
			dbConnection = db.db("sample_airbnb");
			console.log("Successfully connected to MongoDB.");
			return callback();
		});
	},

	/**
	 * @returns {Db}
	 */
	getDb: function () {
		return dbConnection;
	},
};
