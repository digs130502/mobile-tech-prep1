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

        //Set approved status based on role
        const approved = role === "Admin" ? 1 : undefined; //Admin is automatically approved, undefined (null) for QV and learner

        //Insert the new account into the Account table
        db.query(
          "INSERT INTO Account (Email, Pass, AccountType, Approved) VALUES (?, ?, ?, ?)",
          [email, hashedPassword, role, approved],
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

        //Check the approved status
        if (user.Approved === null) {//If waiting approval
          return res.status(403).json({ message: "Waiting for account approval" });
        }

        if (user.Approved === "No" || user.Approved === 0) {//If account was denied
          return res.status(403).json({ message: "Account approval denied" });
        }

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
  db.query(
    "SELECT QuestionID, Question_Text, Difficulty, Topic FROM Question WHERE Approved = 1",
    (err, results) => {
      if (err) {
        //ERROR: Did not get questions
        console.error("Error fetching questions:", err);
        return res.status(500).json({ message: "Error fetching questions" });
      }
      res.status(200).json(results); //Send result
    }
  );
});

//Endpoint to get approved questions created by the logged in Question Volunteer
app.get("/api/questions/volunteer", (req, res) => {
  const accountID = req.query.accountID; //Get the accountID

  if (!accountID) {
    //If no account iD
    return res.status(400).json({ message: "Account ID is required" });
  }

  db.query(
    "SELECT QuestionID, Question_Text FROM Question WHERE creatorID = ? AND Approved = 1",
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

//Endpoint to get questions that are waiting for approval
app.get("/api/questions/volunteer/waiting-approval", (req, res) => {
  const accountID = req.query.accountID; //Get the accountID

  if (!accountID) {//If no accountID
    return res.status(400).json({ message: "Account ID is required" });
  }

  //Get the questions from the creator ID and where the approval status is NULL
  db.query(
    "SELECT QuestionID, Question_Text FROM Question WHERE creatorID = ? AND Approved IS NULL", 
    [accountID],
    (err, results) => {
      if (err) {
        console.error("Error fetching volunteer's questions waiting for approval:", err);
        return res.status(500).json({ message: "Error fetching questions" });
      }

      res.status(200).json(results); //Send the list of questions waiting for approval
    }
  );
});

//Endpoint to get rejected questions
app.get("/api/questions/volunteer/rejected", (req, res) => {
  const accountID = req.query.accountID; //Get the accountID

  if (!accountID) {//If no accountID
    return res.status(400).json({ message: "Account ID is required" });
  }

  //Get the questions from the creator ID and where the approval status is 0 (rejected)
  db.query(
    "SELECT QuestionID, Question_Text FROM Question WHERE creatorID = ? AND Approved = 0", 
    [accountID],
    (err, results) => {
      if (err) {
        console.error("Error fetching volunteer's rejected questions:", err);
        return res.status(500).json({ message: "Error fetching questions" });
      }

      res.status(200).json(results); //Send the list of rejected questions
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
  db.query(
    "SELECT QuestionID, Question_Text, DS_Q, Difficulty, Topic, Hints FROM Question WHERE QuestionID = ?",
    [questionID],
    (err, results) => {
      if (err) {
        //Error message if could not retrieve question info..
        console.error("ERROR: Could not get question info:", err);
        return res
          .status(500)
          .json({ message: "ERROR in getting question info" });
      }
      //No match for the question/questionID
      if (results.length === 0) {
        return res.status(404).json({ message: "QuestionID not found" });
      }

      //Gets result and splits the DS_Q into separate answers instead of one string
      const question = results[0];
      question.answers = question.DS_Q.split(","); //Splits the DS_Q string into array of answers
      delete question.DS_Q; //Delete the original DS_Q
      res.status(200).json(question); //Send the new result with separate answers.
    }
  );
});

//Endpoint to check the user's qeustion history databse to see if they have attempted it before.
app.post("/api/user/history/check", (req, res) => {
  const { accountID, questionID } = req.body; //Use accountID and questionID to search for the entry.
  db.query(
    "SELECT * FROM User_Question_History WHERE AccountID = ? AND QuestionID = ?",
    [accountID, questionID],
    (err, results) => {
      if (err) {
        //Error message if could not check user hist..
        console.error("ERROR: Could not check user history:", err);
        return res
          .status(500)
          .json({ message: "ERROR in getting checking user history" });
      }

      //Checks if a result is found matching both accountID and questionID
      if (results.length > 0) {
        res.json({ exists: true }); //If a match is found then the user has already attempted this question
      } else {
        res.json({ exists: false }); //If there is no match found then its the user's first attempt at the question
      }
    }
  );
});

//Endpoint to update the user's history if attempted before
app.post("/api/user/history/update", (req, res) => {
  const { accountID, questionID, lastAttemptPASSFAIL, hintUsed, bookmarked } = req.body; //Things to retrieve to update in this endpoint
  db.query(
    `UPDATE User_Question_History SET Attempts = Attempts + 1, Last_Attempted = NOW(), LastAttemptPASSFAIL = ?, Correct_Attempts = Correct_Attempts + IF(?, 1, 0), Incorrect_Attempts = Incorrect_Attempts + IF(?, 1, 0), Hint_Used = ?, Bookmarked = ? WHERE AccountID = ? AND QuestionID = ?`,
    [
      lastAttemptPASSFAIL, //For the user's latest attempt (true or false)
      lastAttemptPASSFAIL, //For incrementing correct attempts (increment if it is true)
      !lastAttemptPASSFAIL, //For incrementing incorrect attempts (increments if it is false)
      hintUsed,
      bookmarked,
      accountID, //AccountID
      questionID, //QuestionID
    ],
    (err, results) => {
      if (err) {
        //Error message if could not update user hist..
        console.error("ERROR: Could not update user history:", err);
        return res
          .status(500)
          .json({ message: "ERROR in updating user history" });
      }

      //Checks if the update was successful
      if (results.affectedRows > 0) {
        res.status(200).json({ message: "User history updated" });
      } else {
        res.status(400).json({ message: "No user history record updated" });
      }
    }
  );
});

//Endpoint to insert a question history record for a user (first time)
app.post("/api/user/history/insert", (req, res) => {
  const { accountID, questionID, difficulty, topic, lastAttemptPASSFAIL, hintUsed, bookmarked } =
    req.body; //Retrieve info needed to put in

  const correctAttempts = lastAttemptPASSFAIL ? 1 : 0; //Set Correct Attempts to correct value based on user's last attempt
  const incorrectAttempts = lastAttemptPASSFAIL ? 0 : 1; //Set Incorrect Attempts to correct value based on user's last attempt

  db.query(
    `INSERT INTO User_Question_History (AccountID, QuestionID, Difficulty, Topic, Attempts, Correct_Attempts, Incorrect_Attempts, Last_Attempted, LastAttemptPASSFAIL, Hint_Used, Bookmarked)
  VALUES (?, ?, ?, ?, 1, ?, ?, NOW(), ?, ?, ?)`,
    [
      accountID,
      questionID,
      difficulty,
      topic,
      correctAttempts,
      incorrectAttempts,
      lastAttemptPASSFAIL,
      hintUsed,
      bookmarked
    ],
    (err, results) => {
      if (err) {
        //Error message if could not insert user hist..
        console.error("ERROR: Could not insert user question history:", err);
        return res
          .status(500)
          .json({ message: "ERROR in inserting user history" });
      }

      res.status(200).json({ message: "User question history inserted" }); //Success message
    }
  );
});

// Function to calculate accuracy
function calculateAccuracy(correctAttempts, totalAttempts) {
  if (totalAttempts > 0) {
    return ((correctAttempts / totalAttempts) * 100).toFixed(2);
  }
  return "0";
}

//Endpoint to get user stats and calculate
app.get("/api/user/stats", (req, res) => {
  const accountID = req.query.accountID; //Get the logged-in user's accountID

  if (!accountID) {
    //If accountID is not found
    return res.status(400).json({ message: "AccountID must be present:" });
  }

  db.query(
    `SELECT SUM(Attempts) AS total_attempts, SUM(Correct_Attempts) AS correct_attempts, SUM(CASE WHEN Hint_Used = 'Yes' THEN 1 ELSE 0 END) AS hint_views,
      SUM(CASE WHEN Bookmarked = 'Yes' THEN 1 ELSE 0 END) AS bookmarked_questions FROM User_Question_History WHERE AccountID = ?`,
    [accountID],
    (err, results) => {
      if (err) {
        //Error message if could not retrieve user stats.
        console.error("ERROR: Could not get user stats:", err);
        return res.status(500).json({ message: "ERROR in getting user stats" });
      }

      const totalAttempts = results[0].total_attempts || 0; //saves total attempts, if zero, then set to 0
      const correctAttempts = results[0].correct_attempts || 0; //saves correct attempts, if zzero, then set to 0
      const hintViews = results[0].hint_views || 0; //saves num of hint views, if zzero, then set to 0
      const bookmarkedQuestions = results[0].bookmarked_questions || 0; //saves num of bookmarked questions, if zzero, then set to 0
      const accuracy = calculateAccuracy(correctAttempts, totalAttempts); //calls function to calculate accuracy

      //Sends back calculations/stats for displaying
      res.status(200).json({
        attempted: totalAttempts,
        completed: correctAttempts,
        accuracy: `${accuracy}%`,
        hintViews: hintViews,
        bookmarkedQuestions: bookmarkedQuestions
      });
    }
  );
});

//Endpoint to get question volunteer question stats and calculate
app.get("/api/volunteer/stats", (req, res) => {
  const accountID = req.query.accountID; //Get the logged-in question volunteer's accountID

  //If accountID is not found
  if (!accountID) {
    return res.status(400).json({ message: "AccountID must be present:" });
  }

  db.query(
    `SELECT SUM(UQH.Attempts) AS total_attempts, SUM(UQH.Correct_Attempts) AS correct_attempts, SUM(CASE WHEN UQH.Hint_Used = 'Yes' THEN 1 ELSE 0 END) AS total_hints_viewed,
      SUM(CASE WHEN UQH.Bookmarked = 'Yes' THEN 1 ELSE 0 END) AS total_bookmarks, COUNT(DISTINCT Q.QuestionID) AS total_questions_created FROM Question Q LEFT JOIN User_Question_History UQH ON UQH.QuestionID = Q.QuestionID WHERE Q.creatorID = ?`,
    [accountID],
    (err, results) => {
      if (err) {
        //Error message if could not retrieve question volunteer stats.
        console.error("ERROR: Could not get question volunteer stats:", err);
        return res
          .status(500)
          .json({ message: "ERROR in getting question volunteer stats" });
      }

      const totalAttempts = results[0].total_attempts || 0; //saves total attempts, if zero, then set to 0
      const correctAttempts = results[0].correct_attempts || 0; //saves correct attempts, if zzero, then set to 0
      const accuracy = calculateAccuracy(correctAttempts, totalAttempts); //calls function to calculate accuracy
      const totalHintsViewed = results[0].total_hints_viewed || 0; //saves num of hint views, if zzero, then set to 0
      const totalBookmarks = results[0].total_bookmarks || 0; //saves num of bookmarked questions, if zzero, then set to 0
      const totalQuestionsCreated = results[0].total_questions_created || 0; //saves num of questions created, if zzero, then set to 0

      //Sends back calculations/stats for displaying
      res.status(200).json({
        questionsCreated: totalQuestionsCreated,
        attempted: totalAttempts,
        completed: correctAttempts,
        accuracy: `${accuracy}%`,
        hintsViewed: totalHintsViewed,
        bookmarks: totalBookmarks,
      });
    }
  );
});

//Endpoint to check if email exists in the database
app.post("/api/check/email", (req, res) => {
  const { email } = req.body;

  db.query("SELECT * FROM Account WHERE Email = ?", [email], (err, results) => {
    if (err) {
      //Error message if could not retrieve email.
      console.error("Error checking email:", err);
      return res.status(500).json({ message: "ERROR: Could not check email" });
    }

    //If email was not found.
    if (results.length === 0) {
      return res.status(404).json({ exists: false });
    }

    //If email was successfully found.
    return res.status(200).json({ exists: true });
  });
});

//Endpoint to reset the user's password
app.post("/api/reset/password", async (req, res) => {
  const { email, newPassword } = req.body; //Use email and new password

  //Hash the new password before storing it in the datbase
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  db.query(
    "UPDATE Account SET Pass = ? WHERE Email = ?",
    [hashedPassword, email],
    (err, results) => {
      if (err) {
        //Error message if could not reset pass.
        console.error("Error resetting password:", err);
        return res
          .status(500)
          .json({ message: "ERROR: Could not reset password" });
      }

      //If password was not updated (nothing was changed)
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Email not found" });
      }

      //If password was updated.
      return res.status(200).json({ message: "Password updated successfully" });
    }
  );
});

//Endpoint to check if the user's entered current password is the same as the current password in the database
app.post("/api/check/current/password", async (req, res) => {
  const { email, currentPassword } = req.body; //Use current password.

  //Get the current hashed password from the database
  db.query(
    "SELECT Pass FROM Account WHERE Email = ?",
    [email],
    async (err, results) => {
      if (err) {
        //Error message if could not get pass.
        console.error("Error getting user password:", err);
        return res
          .status(500)
          .json({ message: "ERROR: Could not get password" });
      }

      //If email was not found.
      if (results.length === 0) {
        return res.status(404).json({ message: "Email not found" });
      }

      const currentHashedPassword = results[0].Pass; //Get the password from database

      //Compare the current password with the current password hashed
      const match = await bcrypt.compare(
        currentPassword,
        currentHashedPassword
      );

      if (match) {
        return res.status(400).json({
          isDifferent: false, //The current password is the same as the current database password
        });
      }

      //Else the current password is different than the one in the database
      return res.status(200).json({ isDifferent: true });
    }
  );
});

//Endpoint to check if the user's new password is the same as the current password
app.post("/api/check/new/password", async (req, res) => {
  const { email, newPassword } = req.body; //Use new password

  //Get the current hashed password from the database
  db.query(
    "SELECT Pass FROM Account WHERE Email = ?",
    [email],
    async (err, results) => {
      if (err) {
        //Error message if could not get pass.
        console.error("Error getting user password:", err);
        return res
          .status(500)
          .json({ message: "ERROR: Could not get password" });
      }

      //If email was not found.
      if (results.length === 0) {
        return res.status(404).json({ message: "Email not found" });
      }

      const currentHashedPassword = results[0].Pass; //Get the password from database

      //Compare the new password with the current password hash
      const match = await bcrypt.compare(newPassword, currentHashedPassword);

      if (match) {
        return res.status(400).json({
          isDifferent: false, //The new password is the same as the current password
        });
      }

      return res.status(200).json({ isDifferent: true }); //Else the new password is different than the current on in the database
    }
  );
});

//Endpoint to get user's email
app.get("/api/account/email", (req, res) => {
  const accountID = req.query.accountID; //Get the accountID

  //Get the user's email from database
  db.query(
    "SELECT Email FROM Account WHERE AccountID = ?",
    [accountID],
    (err, results) => {
      if (err) {
        //Error message if could not get email
        console.error("Error getting user email:", err);
        return res
          .status(500)
          .json({ message: "ERROR: Could not get user email" });
      }

      //If email was not found.
      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      //Else email was found, and return the email back.
      return res.status(200).json({ email: results[0].Email });
    }
  );
});

//Endpoint to get the user's full question history
app.get("/api/user/history/details", (req, res) => {
  const accountID = req.query.accountID; //Get the accountID

  //Get the user's history for all questions
  db.query(
    `SELECT q.Question_Text, uqh.Attempts, uqh.Correct_Attempts, uqh.Incorrect_Attempts, uqh.Last_Attempted, uqh.LastAttemptPASSFAIL, q.Difficulty, q.Topic, uqh.Hint_Used, uqh.Bookmarked 
     FROM User_Question_History uqh 
     JOIN Question q ON uqh.QuestionID = q.QuestionID
     WHERE uqh.AccountID = ?`,
    [accountID],
    (err, results) => {
      if (err) {
        //If could not get user question history
        console.error("Error getting question history:", err);
        return res
          .status(500)
          .json({ message: "ERROR: Could not get question history" });
      }

      //Set response with all the data from the query.
      const historyData = results.map((item) => ({
        question: item.Question_Text,
        attempts: item.Attempts,
        correctAttempts: item.Correct_Attempts,
        incorrectAttempts: item.Incorrect_Attempts,
        accuracy: calculateAccuracy(item.Correct_Attempts, item.Attempts), //Use calculateAccuracy function
        difficulty: item.Difficulty,
        topic: item.Topic,
        lastAttempt: item.LastAttemptPASSFAIL !== null ? (item.LastAttemptPASSFAIL === 1 ? "Pass" : "Fail") : "N/A", //Send last attempt passed or failed. N/A if not attempted
        lastAttemptTime: item.Last_Attempted ? item.Last_Attempted : "N/A", //Set "N/A" if no attempt was made
        hintViewed: item.Hint_Used === "Yes" ? "Yes" : "No", //Checks if the hint was viewed
        bookmarked: item.Bookmarked === "Yes" ? "Yes" : "No", //Checks if the question was bookmarked
      }));

      res.status(200).json(historyData); //Send all the history data back for displaying
    }
  );
});

//Endpoint to check if a question is bookmarked by the user
app.post("/api/user/check-bookmark", (req, res) => {
  const { accountID, questionID } = req.body; //Get accountId and questionID

  db.query(
    "SELECT Bookmarked FROM User_Question_History WHERE AccountID = ? AND QuestionID = ?",
    [accountID, questionID],
    (err, results) => {
      if (err) {
        console.error("ERROR: Could not check bookmark status:", err);
        return res
          .status(500)
          .json({ message: "ERROR in checking bookmark status" });
      }

      if (results.length > 0) {
        const bookmarked = results[0].Bookmarked === "Yes"; //If "Yes" in database, then it was bookmarked
        res.json({ bookmarked });
      } else {
        res.json({ bookmarked: false }); //If no history is found, not bookmarked
      }
    }
  );
});

//Endpoint to update a bookmark
app.post("/api/user/history/update-bookmark", (req, res) => {
  const { accountID, questionID, bookmarked, difficulty, topic } = req.body;

  //Check if the history record exists user & question first
  db.query(
    "SELECT * FROM User_Question_History WHERE AccountID = ? AND QuestionID = ?",
    [accountID, questionID],
    (err, results) => {
      if (err) {
        console.error("ERROR: Could not check history record:", err);
        return res.status(500).json({ message: "ERROR in checking history record" });
      }

      if (results.length > 0) {
        //If record exists update the bookmark status based on what the bookmark status is
        db.query(
          "UPDATE User_Question_History SET Bookmarked = ? WHERE AccountID = ? AND QuestionID = ?",
          [bookmarked, accountID, questionID],
          (err, results) => {
            if (err) {
              console.error("ERROR: Could not update bookmark status:", err);
              return res.status(500).json({ message: "ERROR in updating bookmark status" });
            }

            if (results.affectedRows > 0) { //If rows were changed then bookmark was updated.
              return res.status(200).json({ message: "Bookmark updated" });
            } else {
              return res.status(400).json({ message: "Failed to update bookmark status" });
            }
          }
        );
      } else {
        //If no history exists insert a record with the bookmark status, difficulty, and topic values
        db.query(
          "INSERT INTO User_Question_History (AccountID, QuestionID, Bookmarked, Difficulty, Topic) VALUES (?, ?, ?, ?, ?)",
          [accountID, questionID, bookmarked, difficulty, topic],
          (err, results) => {
            if (err) {
              console.error("ERROR: Could not insert new history record:", err);
              return res.status(500).json({ message: "ERROR in inserting new history record" });
            }

            return res.status(200).json({ message: "Bookmark updated (new record)" });
          }
        );
      }
    }
  );
});

//Endpoint to update only the Hint_Used status (and create the record if it doesn't exist)
app.post("/api/user/history/update-hint", (req, res) => {
  const { accountID, questionID, hintUsed, difficulty, topic } = req.body; // Get accountID, questionID, and hintUsed

  //Check if a question history record exists for this user first
  db.query(
    `SELECT * FROM User_Question_History WHERE AccountID = ? AND QuestionID = ?`,
    [accountID, questionID],
    (err, results) => {
      if (err) {
        console.error("ERROR: Could not check history record:", err);
        return res.status(500).json({ message: "ERROR in checking history record" });
      }

      if (results.length > 0) {
        //If the record exists update the Hint_Used field
        db.query(
          `UPDATE User_Question_History SET Hint_Used = ? WHERE AccountID = ? AND QuestionID = ?`,
          [hintUsed, accountID, questionID],
          (err, updateResults) => {
            if (err) {
              console.error("ERROR: Could not update hint usage:", err);
              return res.status(500).json({ message: "ERROR in updating hint usage" });
            }

            //Success message
            res.status(200).json({ message: "Hint usage updated" });
          }
        );
      } else {
        //If no record exists then create a new record with hint_used and other values
        db.query(
          `INSERT INTO User_Question_History (AccountID, QuestionID, Difficulty, Topic, Hint_Used) VALUES (?, ?, ?, ?, ?)`,
          [accountID, questionID, difficulty, topic, hintUsed],
          (err, insertResults) => {
            if (err) {
              console.error("ERROR: Could not insert history record:", err);
              return res.status(500).json({ message: "ERROR in inserting history record" });
            }

            //Success message
            res.status(200).json({ message: "History record created and hint usage updated" });
          }
        );
      }
    }
  );
});

//Endpoint to get all questions that are bookmarked for the user
app.get("/api/user/bookmarked-questions", (req, res) => {
  const accountID = req.query.accountID; //Get the accountID

  db.query(
    `SELECT q.Question_Text
     FROM User_Question_History uqh 
     JOIN Question q ON uqh.QuestionID = q.QuestionID
     WHERE uqh.AccountID = ? AND uqh.Bookmarked = 'Yes'`, //Where Bookmarked = "yes"
    [accountID],
    (err, results) => {
      if (err) {
        console.error("Error getting bookmarked questions:", err);
        return res.status(500).json({ message: "ERROR: Could not get bookmarked questions" });
      }

      //Send the list of bookmarked question texts
      const bookmarkedQuestions = results.map(item => ({
        question: item.Question_Text,
      }));

      res.status(200).json(bookmarkedQuestions);
    }
  );
});

//Endpoint to get accounts pending approval
app.get('/api/admin/pending-accounts', (req, res) => {
  db.query("SELECT AccountID, Email, AccountType, AccountCreationDate FROM Account WHERE Approved IS NULL", (err, results) => {
    if (err) {
      console.error('Error retrieving pending accounts:', err);
      return res.status(500).json({ message: 'Error retrieving pending accounts' });
    }
    res.status(200).json(results); //Send the accounts that are pending approval
  });
});

//Endpoint to approve or reject an account
app.post('/api/admin/approve-account', (req, res) => {
  const { accountID, action } = req.body; //action = 'approve' or 'reject'

  const updateQuery = action === 'approve'
    ? 'UPDATE Account SET Approved = TRUE WHERE AccountID = ?' //True if approve
    : 'UPDATE Account SET Approved = FALSE WHERE AccountID = ?'; //False if reject

  db.query(updateQuery, [accountID], (err, results) => {
    if (err) {
      console.error('Error updating account status:', err);
      return res.status(500).json({ message: 'Error updating account status' });
    }

    res.status(200).json({ message: `Account ${action}d successfully` });
  });
});

//Endpoint to check if the user's account is approved or rejected
app.post("/api/check/approval", async (req, res) => {
  const { email } = req.body;

  db.query(
    "SELECT Approved FROM Account WHERE Email = ?",
    [email],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "ERROR" });
      }

      //If email not in database
      if (results.length === 0) {
        return res.status(404).json({ message: "ERROR: Email not found." });
      }

      const approvalStatus = results[0].Approved; //Get approved field

      //Check the approval status (1 = approved, 0 = rejected, NULL = pending)
      if (approvalStatus === null) {
        return res.status(403).json({ message: "Account is awaiting approval." });
      } else if (approvalStatus === 0) {
        return res.status(403).json({ message: "Account has been rejected." });
      }

      //If approved
      return res.status(200).json({ message: "Account is approved." });
    }
  );
});

//Endpoint to get questions pending approval
app.get("/api/questions/pending", (req, res) => {
  db.query(
    "SELECT QuestionID AS id, Question_Text AS questionText, Topic AS category, Difficulty AS difficulty, DS_Q as answerChoices FROM Question WHERE Approved IS NULL",
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "ERROR: Database query failed." });
      }

      res.status(200).json(results); //Send the list of pending questions
    }
  );
});

//Endpoint to approve or reject a question
app.post("/api/approve/question", (req, res) => {
  const { questionID, approved } = req.body; //Get questionID, approved

  const query = "UPDATE Question SET Approved = ? WHERE QuestionID = ?";
  db.query(query, [approved, questionID], (err, result) => {
    if (err) {
      console.error("Error updating question:", err);
      return res.status(500).json({ message: "ERROR: Failed to update question approval." });
    }

    //Check if any rows changed with the update
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ERROR: Question not found." });
    }

    //Success mesage for question being changed
    res.status(200).json({ message: `Question ID: ${questionID} has been ${approved === 1 ? "approved" : "rejected"}.` });
  });
});

//Start Node.js Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
