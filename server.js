const express = require('express');
const path = require('path');
const fs = require('fs');
// const api = require('./public/assets/js/index.js');
const uuid = require("./helpers/uuid");
const PORT = 3001;
const db = require('./db/db');

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/notes', api);

app.use(express.static('public'));

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);


app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    if (title && text) {
        // Variable for the object we will save
        const newNote = {
            title,
            text,
            'id': uuid(),
        };

        // Obtain existing notes
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                // Convert string into JSON object
                const parsedNotes = JSON.parse(data);

                // Add a new review
                parsedNotes.push(newNote);

                // Write all notes back to the file
                fs.writeFile(
                    './db/db.json',
                    JSON.stringify(parsedNotes, null, 4),
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.info('Successfully updated notes!')
                );
            }
        });

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in saving Note');
    }
})

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Successfully retrieved notes');
            notes = JSON.parse(data);
            res.send(notes);
        }
    })
})

app.delete('/api/notes/:id', (req, res) => {
    if (req.params.id) {
        console.log('Request received to delete note');
        const id = req.params.id;
        for (let i = 0; i < db.length; i++) {
            console.log(db.length);
            const currentId = db[i];
            if (currentId.id === id) {
                db.splice(i, 1);
                console.log(db);
                fs.writeFile(
                    './db/db.json',
                    JSON.stringify(db, null, 4),
                    (writeErr) =>
                    writeErr
                    ? console.error(writeErr)
                    : console.info('Successfully updated notes!')
                );
                res.status(200).json(currentId);
                return;
            }
        }
        res.status(404).send('Review not found');
    } else {
        res.status(400).send('Review ID not provided');
    }
})

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);
