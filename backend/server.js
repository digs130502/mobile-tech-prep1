const express = require('express');
const mysql = require('mysql');

//Initialize Express server
const app = express();
const PORT = 3000; //Specify port

app.use(express.json());

//Initialize connection to MySQL Database
const db = mysql.createConnection({
	host: 'localhost', //your MySQL host name
	user: 'root',  //your MySQL username
	password: '',  //your MySQL password
	database: 'MobileTechPrep'  //the name of the Database created
});

//Connect to MySQL database
db.connect((err) => {
	if (err) {
		console.error('ERROR: Could not connect to MySQL database:', err); //Error message if fails to connect
		return;
	}
	console.log('Successfully connected to MySQL Database');
});

//Endpoint (API) to get all questions
app.get('/api/questions', (req, res) => {
	db.query('SELECT * FROM Question', (err, results) => {
		if (err) {
			return res.status(500).send(err); //Error response if fails
		}
		res.json(results);
	});
});

//Endpoint (API) to get all accounts
app.get('/api/accounts', (req, res) => {
	db.query('SELECT * FROM Account', (err, results) => {
		if (err) {
			return res.status(500).send(err); //Error response if fails
		}
		res.json(results);
	});
});

//Endpoint (API) to get all user question history
app.get('/api/user-question-history', (req, res) => {
	db.query('SELECT * FROM User_Question_History', (err, results) => {
		if (err) {
			return res.status(500).send(err); //Error response if fails
		}
		res.json(results);
	});
});

//Start Node.js Express server
app.listen(PORT, () => {
    	console.log(`Server is running on http://localhost:${PORT}`);
		console.log(`Questions API is available at http://localhost:${PORT}/api/questions`);
		console.log(`User History API is available at http://localhost:${PORT}/api/user-question-history`);
		console.log(`Accounts API is available at http://localhost:${PORT}/api/accounts`);
});