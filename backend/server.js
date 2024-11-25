const express = require("express"); //Importing required modules
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");

//Initialize Express server
const app = express();
const PORT = 3000; //Specify port

//CORS for allowing requests
app.use(
  cors({
    origin: ["http://192.168.x.x:3000", "http://localhost:8081"], //allow requests from web and Android Studios emulator
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

//Initialize connection to MySQL Database
const db = mysql.createConnection({
  host: "localhost", //your MySQL host name
  user: "root", //your MySQL username
  password: "", //your MySQL password
  database: "MobileTechPrep", //the name of the Database created
});

//Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error("ERROR: Could not connect to MySQL database:", err); //Error message if fails to connect
    return;
  }
  console.log("Successfully connected to MySQL Database");
});

//Endpoint for signing up
app.post("/api/signup", async (req, res) => {
  const { email, password, role } = req.body; //get email, password, and role from the request
  try {
    //Check if email already exists in database
    db.query(
      "SELECT * FROM Account WHERE Email = ?",
      [email],
      async (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "ERROR: Database query incorrect" }); //Error message if query goes wrong
        }

        //Checks if email is in database
        if (results.length > 0) {
          return res.status(400).json({ message: "Email is already taken" });
        }

        //Encrypt password if the email does not exist
        const hashedPassword = await bcrypt.hash(password, 10);

        //Insert the new account into the Account table
        db.query(
          "INSERT INTO Account (Email, Pass, AccountType) VALUES (?, ?, ?)",
          [email, hashedPassword, role],
          (err, result) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "ERROR: Could not insert account" }); //Error message if account can't be inserted
            }

            const accountID = result.insertId;

            res.status(201).json({ message: "Account created successfully", accountID }); //Success message if account is inserted.
          }
        );
      }
    );
  } catch (error) {
    console.error("ERROR: Could not sign-up:", error); //General error messages
    res.status(500).json({ message: "Server Error" });
  }
});

//Endpoint for logging in
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body; //get email and password from the request
  try {
    //Check if the account (email) exists in database.
    db.query(
      "SELECT * FROM Account WHERE Email = ?",
      [email],
      async (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "ERROR: Database query incorrect" }); //Error message if query goes wrong
        }

        //Email is not found in the database.
        if (results.length == 0) {
          return res.status(404).json({ message: "Email not found" }); //Error message if email cannot be found.
        }

        const user = results[0]; //Get the first result

        //Compare hashed password to user's inputted password
        const match = await bcrypt.compare(password, user.Pass);
        if (!match) {
          return res.status(401).json({ message: "Incorrect password" }); //Error message if user entered wrong password.
        }

        //Success message that login was successful.
        res
          .status(200)
          .json({ message: "Login successful", accountID: user.AccountID, role: user.AccountType });
      }
    );
  } catch (error) {
    console.error("ERROR: Could not sign-up:", error); //General error messages
    res.status(500).json({ message: "Server Error" });
  }
});

//Endpoint for question-select
app.get("/api/questions", (req, res) => {
  db.query("SELECT QuestionID, Question_Text FROM Question", (err, results) => {
    if (err) {//ERROR: Did not get questions
      console.error("Error fetching questions:", err);
      return res.status(500).json({ message: "Error fetching questions" });
    }
    res.status(200).json(results); //Send result
  });
});

//Endpoint to get questions created by the logged in Question Volunteer
app.get("/api/questions/volunteer", (req, res) => {
  const accountID = req.query.accountID; //Get the accountID

  if (!accountID) {//If no account iD
    return res.status(400).json({ message: "Account ID is required" });
  }

  db.query(
    "SELECT QuestionID, Question_Text FROM Question WHERE creatorID = ?",
    [accountID], //Get the questions from creator ID
    (err, results) => {
      if (err) {
        console.error("Error fetching volunteer's questions:", err);
        return res.status(500).json({ message: "Error fetching questions" });
      }

      res.status(200).json(results); //Send the list of questions
    }
  );
});

//Endpoint for creating a new question
app.post("/api/questions/create", (req, res) => {
  //Get all parts of the request body
  const { question, answers, hint, difficulty, topic, pseudo_q, tsc_q, ds_q, creatorID } = req.body;

  //If certain fields are empty
  if (!question || !answers || !creatorID) {
    return res.status(400).json({ message: "Question, answers, and creatorID are required" });
  }

  //Join answers together
  const answersText = answers.join(", ");

  //Insert question into the mysql database
  db.query(
    "INSERT INTO Question (Difficulty, Topic, Question_Text, DS_Q, Pseudo_Q, TSC_Q, Hints, creatorID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [difficulty, topic, question, answersText, pseudo_q, tsc_q, hint, creatorID],
    (err, result) => {
      if (err) { //ERROR: Could not insert
        console.error("Error inserting question:", err);
        return res.status(500).json({ message: "Error inserting question" });
      }

      //Get the ID of the new question
      const newQuestionID = result.insertId;
      res.status(201).json({ message: "Question created successfully", questionID: newQuestionID }); //Success message
    }
  );
});


//Start Node.js Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
