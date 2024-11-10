-- Create a new database (only if it doesn't exist already)
CREATE DATABASE IF NOT EXISTS MobileTechPrep;

-- Select the database to use
USE MobileTechPrep;

-- 1. Create the Question Database
CREATE TABLE Question (
    QuestionID INT NOT NULL,
    Difficulty VARCHAR(50),
    Topic VARCHAR(100),
    Question_Text TEXT,
    DS_Q TEXT,
    Pseudo_Q TEXT,
    TSC_Q TEXT,
    Hints TEXT,
    PRIMARY KEY (QuestionID)
);

-- 2. Create the User Question History Database with foreign key referencing Question table
CREATE TABLE User_Question_History (
    QuestionID INT NOT NULL,
    Difficulty VARCHAR(50),
    Topic VARCHAR(100),
    Last_Attempted TIMESTAMP,
    LastAttemptPASSFAIL BOOLEAN,
    PRIMARY KEY (QuestionID),
    FOREIGN KEY (QuestionID) REFERENCES Question(QuestionID)
);

-- 3. Create the Account Database
CREATE TABLE Account (
    AccountID INT NOT NULL,
    AccountType VARCHAR(50),
    AccountCreationDate DATE,
    PRIMARY KEY (AccountID)
);

-- Inserting 10 additional questions into the Question database with consistent column values

INSERT INTO Question (QuestionID, Difficulty, Topic, Question_Text, DS_Q, Pseudo_Q, TSC_Q, Hints)
VALUES 
    (6, 
     'Easy', 
     'Arrays', 
     'Given an array of integers, return the indices of the two numbers that add up to a specific target.',  -- Question_Text
     'HashMap,Trees,Stack,Array', 
     'Check if (target - num) is in HashMap,Loop through pairs to find sum,Sort and use two pointers,Compare each number with others', 
     'O(n),O(n^2),O(log n),O(1)',  
     'Consider an efficient lookup structure'), 

    (7, 
     'Easy', 
     'Linked Lists', 
     'Reverse a singly linked list.', 
     'LinkedList,Array,Stack', 
     'Iterate and reverse links one by one,Use a stack to reverse values,Convert to array and reverse,Use recursive function to swap nodes', 
     'O(n),O(n^2),O(log n)', 
     'Consider updating each node’s next pointer'), 

    (8, 
     'Medium', 
     'Hashing', 
     'Find the first non-repeating character in a string.', 
     'HashMap,Array,List', 
     'Store counts in HashMap and check for count 1,Sort characters and compare neighbors,Use nested loops to check repeats,Convert string to list and remove duplicates', 
     'O(n),O(n^2),O(log n)', 
     'Try storing character counts as you traverse the string'), 

    (9, 
     'Hard', 
     'Graphs', 
     'Detect a cycle in an undirected graph.', 
     'Graph,Tree,LinkedList', 
     'Use DFS with visited nodes check,Loop through each edge,Use BFS and mark nodes,Convert graph to matrix and check paths', 
     'O(V+E),O(V^2),O(V log V)', 
     'Think about marking nodes during traversal'), 

    (10, 
     'Easy', 
     'Arrays', 
     'Find the maximum subarray sum.', 
     'Array,List,HashMap', 
     'Use a running sum and reset at negative values,Sort array and return sum of positive numbers,Loop and track max difference,Compare pairs and store max sum', 
     'O(n),O(n^2),O(log n)', 
     'Consider a running total that resets when negative'), 

    (11, 
     'Medium', 
     'Binary Trees', 
     'Check if a binary tree is a valid binary search tree (BST).', 
     'Tree,Graph,Array', 
     'Use in-order traversal and check sorted order,Use BFS to check each level,Convert to array and check sorted,Use recursion to check node bounds', 
     'O(n),O(n^2),O(log n)', 
     'An in-order traversal can be helpful here'), 

    (12, 
     'Medium', 
     'Dynamic Programming', 
     'Solve the coin change problem for a given amount and denominations.', 
     'Array,Tree,HashMap', 
     'Use a table to store subproblem solutions,Loop through all combinations,Use nested loops to build solutions,Convert denominations to graph nodes', 
     'O(n*m),O(2^n),O(n log n)', 
     'Think about storing solutions to subproblems'), 

    (13, 
     'Easy', 
     'Strings', 
     'Determine if a string is a palindrome.', 
     'String,List,Array', 
     'Compare characters from both ends,Convert to list and sort,Use hash to store character counts,Compare all pairs of characters', 
     'O(n),O(n^2),O(log n)', 
     'Try comparing characters from the beginning and end simultaneously'), 

    (14, 
     'Medium', 
     'Sorting', 
     'Sort an array of 0s, 1s, and 2s in linear time.', 
     'Array,List,Stack', 
     'Use three pointers for each value,Sort and then remove duplicates,Loop and swap at each index,Track each element with a stack', 
     'O(n),O(n^2),O(log n)', 
     'Consider using three pointers to organize the values'), 

    (15, 
     'Hard', 
     'Recursion', 
     'Generate all valid combinations of n pairs of parentheses.', 
     'String,Array,Tree', 
     'Use recursion with open/close counters,Generate all combinations and filter valid,Use two nested loops for each pair,Use stack to add and remove parentheses', 
     'O(2^n),O(n^2),O(log n)', 
     'A recursive approach may help manage each opening and closing bracket'), 

    (16, 
     'Hard', 
     'Graphs', 
     'Find the shortest path in a weighted graph.', 
     'Graph,Tree,List', 
     'Use Dijkstra’s algorithm with a priority queue,Convert to adjacency matrix and loop,Use DFS to find minimum path,Sort edges and traverse all nodes', 
     'O(V+E log V),O(V^2),O(log V)', 
     'Using a priority queue may improve efficiency on each node visit');

-- Insert data into User Question History Database using only valid QuestionIDs from Question table
INSERT INTO User_Question_History (QuestionID, Difficulty, Topic, Last_Attempted, LastAttemptPASSFAIL)
VALUES 
    (15, 'Hard', 'Recursion', '2024-10-01 10:30:00', TRUE),
    (7, 'Easy', 'Linked Lists', '2024-10-05 12:45:00', FALSE),
    (8, 'Medium', 'Hashing', '2024-10-10 15:15:00', TRUE),
    (9, 'Hard', 'Graphs', '2024-10-12 09:25:00', FALSE),
    (6, 'Medium', 'Dynamic Programming', '2024-10-15 18:00:00', TRUE);


-- Insert data into Account Database
INSERT INTO Account (AccountID, AccountType, AccountCreationDate)
VALUES 
    (101, 'Student', '2023-01-15'),
    (102, 'Admin', '2022-05-10'),
    (103, 'Student', '2023-09-01'),
    (104, 'Guest', '2023-11-22'),
    (105, 'Student', '2024-02-18');
Select * from Question;
Select * from User_Question_History;
Select * from Account;
