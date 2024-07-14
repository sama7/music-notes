const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { DateTime } = require('luxon');

// This will help us connect to the database
const dbo = require('../db/conn');

// This section will help you get a list of all the notes.
router.route('/?').get(function (req, res) {
    const user = req.query.user;
    const playlist = req.query.playlist;
    const db_connect = dbo.getDb();
    db_connect
        .collection("notes")
        .find({
            user: user,
            playlist: playlist,
        })
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

// This section will help you create a new note.
router.route('/add').post([
    body('user')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('User ID must be specified.'),
    body('playlist')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Playlist ID must be specified.'),
    body('track')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Track ID must be specified.'),
    body('note')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Note must be non-empty.'),
    function (req, response) {
        const db_connect = dbo.getDb();
        const myobj = {
            user: req.body.user,
            playlist: req.body.playlist,
            track: req.body.track,
            note: req.body.note,
            timeCreated: DateTime.now(),
            timeModified: DateTime.now(),
        };
        db_connect.collection("notes").insertOne(myobj, function (err, res) {
            if (err) throw err;
            response.json(res);
        });
    }
]);

router.route('/update').post([
    body('user')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('User ID must be specified.'),
    body('playlist')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Playlist ID must be specified.'),
    body('track')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Track ID must be specified.'),
    body('note')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage('Note must be non-empty.'),
    function (req, response) {
        const db_connect = dbo.getDb();
        const myquery = {
            user: req.query.user,
            playlist: req.query.playlist,
            track: req.query.track,
        };
        const newvalues = {
            $set: {
                note: req.body.note,
                timeModified: DateTime.now(),
            },
        };
        db_connect
            .collection("notes")
            .updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err;
                console.log("1 document updated");
                response.json(res);
            });
    }
]);

router.route("/delete").delete((req, response) => {
    const db_connect = dbo.getDb();
    const myquery = {
        user: req.query.user,
        playlist: req.query.playlist,
        track: req.query.track,
    };
    db_connect.collection("notes").deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
        response.json(obj);
    });
});

module.exports = router;