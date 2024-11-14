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

-- 2. Create the Account Database
CREATE TABLE Account (
    AccountID INT NOT NULL AUTO_INCREMENT,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Pass VARCHAR(255) NOT NULL,
    AccountType VARCHAR(50) NOT NULL,
    AccountCreationDate DATE DEFAULT (CURRENT_DATE),
    PRIMARY KEY (AccountID)
);

-- 3. Create the User Question History Database with foreign key referencing Question table
CREATE TABLE User_Question_History (
	HistoryID INT NOT NULL AUTO_INCREMENT,
    AccountID INT NOT NULL,
    QuestionID INT NOT NULL,
    Difficulty VARCHAR(50),
    Topic VARCHAR(100),
    Last_Attempted TIMESTAMP,
    LastAttemptPASSFAIL BOOLEAN,
    PRIMARY KEY (HistoryID),
    FOREIGN KEY (AccountID) REFERENCES Account(AccountID),
    FOREIGN KEY (QuestionID) REFERENCES Question(QuestionID)
);

-- Inserting 10 additional questions into the Question database with consistent column values

INSERT INTO Question (QuestionID, Difficulty, Topic, Question_Text, DS_Q, Pseudo_Q, TSC_Q, Hints)
VALUES 
    (1, 
     'Easy', 
     'Arrays', 
     'Given an array of integers, return the indices of the two numbers that add up to a specific target.',  -- Question_Text
     'HashMap,Trees,Stack,Array', 
     'Check if (target - num) is in HashMap,Loop through pairs to find sum,Sort and use two pointers,Compare each number with others', 
     'O(n),O(n^2),O(log n),O(1)',  
     'Consider an efficient lookup structure'), 

    (2, 
     'Easy', 
     'Linked Lists', 
     'Reverse a singly linked list.', 
     'LinkedList,Array,Stack', 
     'Iterate and reverse links one by one,Use a stack to reverse values,Convert to array and reverse,Use recursive function to swap nodes', 
     'O(n),O(n^2),O(log n)', 
     'Consider updating each node’s next pointer'), 

    (3, 
     'Medium', 
     'Hashing', 
     'Find the first non-repeating character in a string.', 
     'HashMap,Array,List', 
     'Store counts in HashMap and check for count 1,Sort characters and compare neighbors,Use nested loops to check repeats,Convert string to list and remove duplicates', 
     'O(n),O(n^2),O(log n)', 
     'Try storing character counts as you traverse the string'), 

    (4, 
     'Hard', 
     'Graphs', 
     'Detect a cycle in an undirected graph.', 
     'Graph,Tree,LinkedList', 
     'Use DFS with visited nodes check,Loop through each edge,Use BFS and mark nodes,Convert graph to matrix and check paths', 
     'O(V+E),O(V^2),O(V log V)', 
     'Think about marking nodes during traversal'), 

    (5, 
     'Easy', 
     'Arrays', 
     'Find the maximum subarray sum.', 
     'Array,List,HashMap', 
     'Use a running sum and reset at negative values,Sort array and return sum of positive numbers,Loop and track max difference,Compare pairs and store max sum', 
     'O(n),O(n^2),O(log n)', 
     'Consider a running total that resets when negative'), 

    (6, 
     'Medium', 
     'Binary Trees', 
     'Check if a binary tree is a valid binary search tree (BST).', 
     'Tree,Graph,Array', 
     'Use in-order traversal and check sorted order,Use BFS to check each level,Convert to array and check sorted,Use recursion to check node bounds', 
     'O(n),O(n^2),O(log n)', 
     'An in-order traversal can be helpful here'), 

    (7, 
     'Medium', 
     'Dynamic Programming', 
     'Solve the coin change problem for a given amount and denominations.', 
     'Array,Tree,HashMap', 
     'Use a table to store subproblem solutions,Loop through all combinations,Use nested loops to build solutions,Convert denominations to graph nodes', 
     'O(n*m),O(2^n),O(n log n)', 
     'Think about storing solutions to subproblems'), 

    (8, 
     'Easy', 
     'Strings', 
     'Determine if a string is a palindrome.', 
     'String,List,Array', 
     'Compare characters from both ends,Convert to list and sort,Use hash to store character counts,Compare all pairs of characters', 
     'O(n),O(n^2),O(log n)', 
     'Try comparing characters from the beginning and end simultaneously'), 

    (9, 
     'Medium', 
     'Sorting', 
     'Sort an array of 0s, 1s, and 2s in linear time.', 
     'Array,List,Stack', 
     'Use three pointers for each value,Sort and then remove duplicates,Loop and swap at each index,Track each element with a stack', 
     'O(n),O(n^2),O(log n)', 
     'Consider using three pointers to organize the values'), 

    (10, 
     'Hard', 
     'Recursion', 
     'Generate all valid combinations of n pairs of parentheses.', 
     'String,Array,Tree', 
     'Use recursion with open/close counters,Generate all combinations and filter valid,Use two nested loops for each pair,Use stack to add and remove parentheses', 
     'O(2^n),O(n^2),O(log n)', 
     'A recursive approach may help manage each opening and closing bracket'), 

    (11, 
     'Hard', 
     'Graphs', 
     'Find the shortest path in a weighted graph.', 
     'Graph,Tree,List', 
     'Use Dijkstra’s algorithm with a priority queue,Convert to adjacency matrix and loop,Use DFS to find minimum path,Sort edges and traverse all nodes', 
     'O(V+E log V),O(V^2),O(log V)', 
     'Using a priority queue may improve efficiency on each node visit');

Select * from Question;
Select * from User_Question_History;
Select * from Account;