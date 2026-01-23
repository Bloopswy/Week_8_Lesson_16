const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3001;

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};

const app = express();
app.use(express.json());

app.listen(port, () => {
    console.log('Server started on port', port);
});

app.get('/allmovies', async (req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM defaultdb.movies');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error for allmovies'});
    }
});

app.post('/addmovie', async (req,res) => {
    const {movie_name, movie_year, movie_pic} = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO movies (movie_name, movie_year, movie_pic) VALUES (?, ?, ?)', [movie_name, movie_year, movie_pic]);
        res.status(201).json({message: 'Movie ' + movie_name +' added successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error - could not add movie ' + movie_name});
    }
});

app.delete('/deletemovie/:id', async (req,res) => {
    const {id} = req.params;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('DELETE FROM movies WHERE id ='+ id);
        res.json({message: 'Movie deleted successfully'});
    }catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not delete movie '});
    }
});

app.put('/updatemovie', async (req,res) => {
    const {id} =req.params;
    const {movie_name, movie_year, movie_pic, id} = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('UPDATE movies SET movie_name = ?, movie_year = ?, movie_pic = ? WHERE id = ?',[movie_name, movie_year, movie_pic, id]);
        res.status(201).json({message: 'Movie '+movie_name+ ' updated successfully'});
    }catch(err) {
        console.error(err);
        res.status(500).json({message: 'Server error - could not update movie '+movie_name});
    }
});