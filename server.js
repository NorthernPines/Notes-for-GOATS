const express = require('express');
const path = require('path');
const fs = require('fs');
// const api = require('./public/assets/js/index.js');
const uuid = require("./helpers/uuid");
const PORT = 3001;

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

    app.get('*', (req, res) =>
      res.sendFile(path.join(__dirname, '/public/index.html'))
    );

    app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
    );
    