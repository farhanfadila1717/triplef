const express = require('express');
const mysql = require('mysql');
const app = express();

// CREATE connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'triplef'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('My sql connected');
});

app.get('/createdb', (req, res) => {
  let sql = 'CREATE DATABASE triplef';
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send('Database created');
  });
});

app.listen('3000', () => {
  console.log('Server started on port 3000');
});