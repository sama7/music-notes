const express = require('express');
const router = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');

// This section will help you create a new note.
router.route('/add').post(function (req, response) {
    let db_connect = dbo.getDb();
    let myobj = {
        user: req.body.user,
        playlist: req.body.playlist,
        track: req.body.track,
        note: req.body.note,
    };
    db_connect.collection("notes").insertOne(myobj, function (err, res) {
        if (err) throw err;
        response.json(res);
    });
});

module.exports = router;