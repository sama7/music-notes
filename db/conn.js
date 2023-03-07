const { MongoClient } = require('mongodb');
const Db = process.env.MONGODB_URI || process.env.DEV_MONGODB_URI;
const dbName = process.env.DB_NAME || process.env.DEV_DB_NAME;
const client = new MongoClient(Db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let _db;

module.exports = {
    connectToServer: async function (callback) {
        try {
            await client.connect();
            // Verify we got a good "db" object
            await client.db(dbName).command({ ping: 1 });
            _db = client.db(dbName);
            console.log('Successfully connected to MongoDB.');
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    },

    getDb: function () {
        return _db;
    },
};