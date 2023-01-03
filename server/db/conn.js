const { MongoClient } = require('mongodb');
const Db = process.env.ATLAS_URI;
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
            await client.db('music_notes').command({ ping: 1 });
            _db = client.db('music_notes');
            console.log('Successfully connected to MongoDB.');
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    },

    getDb: function () {
        return _db;
    },
};