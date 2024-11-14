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
    origin: ["http://192.168.1.159:3000", "http://localhost:8081"], //allow requests from web and Android Studios emulator
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
            res.status(201).json({ message: "Account created successfully" }); //Success message if account is inserted.
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
        res.status(200).json({ message: "Login successful" });
      }
    );
  } catch (error) {
    console.error("ERROR: Could not sign-up:", error); //General error messages
    res.status(500).json({ message: "Server Error" });
  }
});

//Start Node.js Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
