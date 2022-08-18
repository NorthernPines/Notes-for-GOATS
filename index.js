const express = require('express');
const fs = require('fs');
const app = express();

// const diagnosticsRouter = require('./diagnostics');

// app.use('/diagnostics', diagnosticsRouter);

document.getElementById('#save').addEventListener('click', saveNote)

function saveNote() {
    const noteTitle = document.getElementById('note-title').val;
    const noteText = document.getElementById('note-text').val;

    // If all the required properties are present
    if (noteTitle && noteText) {
        // Variable for the object we will save
        const newNote = {
            noteTitle,
            noteText,
        };

        // Obtain existing reviews
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                // Convert string into JSON object
                const parsedNotes = JSON.parse(data);

                // Add a new review
                parsedNotes.push(newNote);

                // Write updated reviews back to the file
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
}

module.exports = app;