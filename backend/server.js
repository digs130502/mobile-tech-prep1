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

            res
              .status(201)
              .json({ message: "Account created successfully", accountID }); //Success message if account is inserted.
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
        res.status(200).json({
          message: "Login successful",
          accountID: user.AccountID,
          role: user.AccountType,
        });
      }
    );
  } catch (error) {
    console.error("ERROR: Could not sign-up:", error); //General error messages
    res.status(500).json({ message: "Server Error" });
  }
});

//Endpoint for question-select
app.get("/api/questions", (req, res) => {
  db.query("SELECT QuestionID, Question_Text, Difficulty, Topic FROM Question", (err, results) => {
    if (err) {
      //ERROR: Did not get questions
      console.error("Error fetching questions:", err);
      return res.status(500).json({ message: "Error fetching questions" });
    }
    res.status(200).json(results); //Send result
  });
});

//Endpoint to get questions created by the logged in Question Volunteer
app.get("/api/questions/volunteer", (req, res) => {
  const accountID = req.query.accountID; //Get the accountID

  if (!accountID) {
    //If no account iD
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
  const {
    question,
    answers,
    hint,
    difficulty,
    topic,
    pseudo_q,
    tsc_q,
    ds_q,
    creatorID,
  } = req.body;

  //If certain fields are empty
  if (!question || !answers || !creatorID) {
    return res
      .status(400)
      .json({ message: "Question, answers, and creatorID are required" });
  }

  //Join answers together
  const answersText = answers.join(", ");

  //Insert question into the mysql database
  db.query(
    "INSERT INTO Question (Difficulty, Topic, Question_Text, DS_Q, Pseudo_Q, TSC_Q, Hints, creatorID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      difficulty,
      topic,
      question,
      answersText,
      pseudo_q,
      tsc_q,
      hint,
      creatorID,
    ],
    (err, result) => {
      if (err) {
        //ERROR: Could not insert
        console.error("Error inserting question:", err);
        return res.status(500).json({ message: "Error inserting question" });
      }

      //Get the ID of the new question
      const newQuestionID = result.insertId;
      res.status(201).json({
        message: "Question created successfully",
        questionID: newQuestionID,
      }); //Success message
    }
  );
});

//Endpoint to retrieve question info
app.get("/api/question/:id", (req, res) => {
  const questionID = req.params.id; //Get the logged-in questionvolunteers's accountID
  db.query("SELECT QuestionID, Question_Text, DS_Q, Difficulty, Topic FROM Question WHERE QuestionID = ?",[questionID],
    (err, results) => {
      if (err) { //Error message if could not retrieve question info..
        console.error("ERROR: Could not get question info:", err);
        return res.status(500).json({ message: "ERROR in getting question info" });
      }
      //No match for the question/questionID
      if (results.length === 0) {
        return res.status(404).json({ message: "QuestionID not found" });
      }

      //Gets result and splits the DS_Q into separate answers instead of one string
      const question = results[0];
      question.answers = question.DS_Q.split(",");  //Splits the DS_Q string into array of answers
      delete question.DS_Q; //Delete the original DS_Q
      res.status(200).json(question); //Send the new result with separate answers.
    }
  );
});

//Endpoint to check the user's qeustion history databse to see if they have attempted it before.
app.post('/api/user/history/check', (req, res) => {
  const { accountID, questionID } = req.body; //Use accountID and questionID to search for the entry.
  db.query("SELECT * FROM User_Question_History WHERE AccountID = ? AND QuestionID = ?", [accountID, questionID], 
    (err, results) => {
    if (err) { //Error message if could not check user hist..
      console.error("ERROR: Could not check user history:", err);
      return res.status(500).json({ message: "ERROR in getting checking user history" });
    }

    //Checks if a result is found matching both accountID and questionID
    if (results.length > 0) {
      res.json({ exists: true }); //If a match is found then the user has already attempted this question
    } else {
      res.json({ exists: false }); //If there is no match found then its the user's first attempt at the question
    }
  });
});

//Endpoint to update the user's history if attempted before
app.post('/api/user/history/update', (req, res) => {
  const { accountID, questionID, lastAttemptPASSFAIL } = req.body; //Things to retrieve to update in this endpoint
  db.query(`UPDATE User_Question_History SET Attempts = Attempts + 1, Last_Attempted = NOW(), LastAttemptPASSFAIL = ?, Correct_Attempts = Correct_Attempts + IF(?, 1, 0), Incorrect_Attempts = Incorrect_Attempts + IF(?, 1, 0) WHERE AccountID = ? AND QuestionID = ?`, [
    lastAttemptPASSFAIL,  //For the user's latest attempt (true or false)
    lastAttemptPASSFAIL,  //For incrementing correct attempts (increment if it is true)
    !lastAttemptPASSFAIL, //For incrementing incorrect attempts (increments if it is false)
    accountID, //AccountID
    questionID //QuestionID
  ], (err, results) => {
    if (err) { //Error message if could not update user hist..
      console.error("ERROR: Could not update user history:", err);
      return res.status(500).json({ message: "ERROR in updating user history" });
    }
    
    //Checks if the update was successful
    if (results.affectedRows > 0) {
      res.status(200).json({ message: "User history updated" });
    } else {
      res.status(400).json({ message: "No user history record updated" });
    }
  });
});

//Endpoint to insert a question history record for a user (first time)
app.post('/api/user/history/insert', (req, res) => {
  const { accountID, questionID, difficulty, topic, lastAttemptPASSFAIL } = req.body; //Retrieve info needed to put in

  const correctAttempts = lastAttemptPASSFAIL ? 1 : 0; //Set Correct Attempts to correct value based on user's last attempt
  const incorrectAttempts = lastAttemptPASSFAIL ? 0 : 1;//Set Incorrect Attempts to correct value based on user's last attempt

  db.query(`INSERT INTO User_Question_History (AccountID, QuestionID, Difficulty, Topic, Attempts, Correct_Attempts, Incorrect_Attempts, Last_Attempted, LastAttemptPASSFAIL)
  VALUES (?, ?, ?, ?, 1, ?, ?, NOW(), ?)`, [accountID, questionID, difficulty, topic, correctAttempts, incorrectAttempts, lastAttemptPASSFAIL], (err, results) => {
    if (err) { //Error message if could not insert user hist..
      console.error("ERROR: Could not insert user question history:", err);
      return res.status(500).json({ message: "ERROR in inserting user history" });
    }
    
    res.status(200).json({ message: "User question history inserted" }); //Success message
  });
});

// Function to calculate accuracy
function calculateAccuracy(correctAttempts, totalAttempts) {
  if (totalAttempts > 0) {
    return ((correctAttempts / totalAttempts) * 100).toFixed(2);
  }
  return "0";
}

//Endpoint to get user stats and calculate
app.get('/api/user/stats', (req, res) => {
  const accountID = req.query.accountID; //Get the logged-in user's accountID

  if (!accountID) { //If accountID is not found
    return res.status(400).json({ message: "AccountID must be present:" });
  }

  db.query(`SELECT SUM(Attempts) AS total_attempts, SUM(Correct_Attempts) AS correct_attempts FROM User_Question_History WHERE AccountID = ?`, [accountID], (err, results) => {
    if (err) {//Error message if could not retrieve user stats.
      console.error("ERROR: Could not get user stats:", err);
      return res.status(500).json({ message: "ERROR in getting user stats" });
    }

    const totalAttempts = results[0].total_attempts || 0; //saves total attempts, if zero, then set to 0
    const correctAttempts = results[0].correct_attempts || 0; //saves correct attempts, if zzero, then set to 0
    const accuracy = calculateAccuracy(correctAttempts, totalAttempts); //calls function to calculate accuracy

    //Sends back calculations/stats for displaying
    res.status(200).json({ attempted: totalAttempts, completed: correctAttempts, accuracy: `${accuracy}%`,
    });
  });
});

//Endpoint to get question volunteer question stats and calculate
app.get('/api/volunteer/stats', (req, res) => {
  const accountID = req.query.accountID;  //Get the logged-in question volunteer's accountID

  //If accountID is not found
  if (!accountID) {
    return res.status(400).json({ message: "AccountID must be present:" });
  }

  db.query("SELECT SUM(UQH.Attempts) AS total_attempts, SUM(UQH.Correct_Attempts) AS correct_attempts FROM User_Question_History UQH JOIN Question Q ON UQH.QuestionID = Q.QuestionID WHERE Q.creatorID = ?", [accountID], 
    (err, results) => {
    if (err) { //Error message if could not retrieve question volunteer stats.
      console.error("ERROR: Could not get question volunteer stats:", err);
      return res.status(500).json({ message: "ERROR in getting question volunteer stats" });
    }

    const totalAttempts = results[0].total_attempts || 0; //saves total attempts, if zero, then set to 0
    const correctAttempts = results[0].correct_attempts || 0; //saves correct attempts, if zzero, then set to 0
    const accuracy = calculateAccuracy(correctAttempts, totalAttempts); //calls function to calculate accuracy

    //Sends back calculations/stats for displaying
    res.status(200).json({ attempted: totalAttempts, completed: correctAttempts, accuracy: `${accuracy}%`,
    });
  });
});

//Start Node.js Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
