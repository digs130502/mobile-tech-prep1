-- Create a new database (only if it doesn't exist already)
CREATE DATABASE IF NOT EXISTS MobileTechPrep;

-- Select the database to use
USE MobileTechPrep;

-- 1. Create the Account Database
CREATE TABLE Account (
    AccountID INT NOT NULL AUTO_INCREMENT,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Pass VARCHAR(255) NOT NULL,
    AccountType VARCHAR(50) NOT NULL,
    AccountCreationDate DATE DEFAULT (CURRENT_DATE),
    Approved BOOLEAN DEFAULT NULL,
    PRIMARY KEY (AccountID)
);

-- 2. Create the Question Database
CREATE TABLE Question (
    QuestionID INT NOT NULL AUTO_INCREMENT,
    Difficulty VARCHAR(50),
    Topic VARCHAR(100),
    Question_Text TEXT,
    DS_Q TEXT,
    Pseudo_Q TEXT,
    TSC_Q TEXT,
    Hints TEXT,
    creatorID INT,
    Approved BOOLEAN DEFAULT NULL,
    PRIMARY KEY (QuestionID),
    FOREIGN KEY (creatorID) REFERENCES Account(AccountID)
);

-- 3. Create the User Question History Database
CREATE TABLE User_Question_History (
    AccountID INT NOT NULL,
    QuestionID INT NOT NULL,
    Difficulty VARCHAR(50),
    Topic VARCHAR(100),
    Attempts INT DEFAULT 0,
    Correct_Attempts INT DEFAULT 0,
    Incorrect_Attempts INT DEFAULT 0,
    Last_Attempted TIMESTAMP,
    LastAttemptPASSFAIL BOOLEAN,
    Hint_Used VARCHAR(3) DEFAULT 'No',
    Bookmarked VARCHAR(3) DEFAULT 'No',
    PRIMARY KEY (AccountID, QuestionID),
    FOREIGN KEY (AccountID) REFERENCES Account(AccountID),
    FOREIGN KEY (QuestionID) REFERENCES Question(QuestionID)
);

-- Insert two example QV accounts into the Account table

INSERT INTO Account (Email, Pass, AccountType, Approved)
VALUES 
    ('example1@gmail.com', 'pass1', 'QuestionVolunteer', '1'),
    ('example2@yahoo.com', 'pass2', 'QuestionVolunteer', '1');

-- Inserting 10 additional questions into the Question database with consistent column values

INSERT INTO Question (QuestionID, Difficulty, Topic, Question_Text, DS_Q, Pseudo_Q, TSC_Q, Hints, creatorID, Approved)
VALUES 
    (1, 
     'Easy', 
     'Arrays', 
     'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]

Example 3:
Input: nums = [3,3], target = 6
Output: [0,1]', 
     'HashMap,Trees,Stack,Array', 
     'Check if (target - num) is in HashMap,Loop through pairs to find sum,Sort and use two pointers,Compare each number with others', 
     'O(n),O(n^2),O(log n),O(1)',  
     'Consider an efficient lookup structure', 1, '1'), 

    (2, 
     'Easy', 
     'Linked Lists', 
     'Reverse a singly linked list.

Given the head of a singly linked list, reverse the list and return its head.

Example:
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]

Constraints:
- The number of nodes in the list is in the range [0, 5000].
- Each node value is between -5000 and 5000.', 
     'LinkedList,Array,Stack', 
     'Iterate and reverse links one by one,Use a stack to reverse values,Convert to array and reverse,Use recursive function to swap nodes', 
     'O(n),O(n^2),O(log n)', 
     'Consider updating each node’s next pointer', 1, '1'), 

    (3, 
     'Medium', 
     'Hashing', 
     'Find the first non-repeating character in a string.

Given a string s, find the first non-repeating character and return its index. If no such character exists, return -1.

Example:
Input: s = "leetcode"
Output: 0

Input: s = "loveleetcode"
Output: 2

Constraints:
- 1 <= s.length <= 10^5
- s consists of only lowercase English letters.', 
     'HashMap,Array,List', 
     'Store counts in HashMap and check for count 1,Sort characters and compare neighbors,Use nested loops to check repeats,Convert string to list and remove duplicates', 
     'O(n),O(n^2),O(log n)', 
     'Try storing character counts as you traverse the string', 1, '1'), 

    (4, 
     'Hard', 
     'Graphs', 
     'Detect a cycle in an undirected graph.

Given an undirected graph, determine if it contains a cycle.

Example:
Input: edges = [[0,1],[1,2],[2,0]]
Output: True

Input: edges = [[0,1],[1,2],[2,3]]
Output: False

Constraints:
- The graph contains n nodes and m edges.', 
     'Graph,Tree,LinkedList', 
     'Use DFS with visited nodes check,Loop through each edge,Use BFS and mark nodes,Convert graph to matrix and check paths', 
     'O(V+E),O(V^2),O(V log V)', 
     'Think about marking nodes during traversal', 1, '1'), 

    (5, 
     'Easy', 
     'Arrays', 
     'Find the maximum subarray sum.

Given an integer array nums, find the contiguous subarray with the largest sum and return its sum.

Example:
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: [4,-1,2,1] has the largest sum = 6.

Constraints:
- 1 <= nums.length <= 10^5
- -10^4 <= nums[i] <= 10^4.', 
     'Array,List,HashMap', 
     'Use a running sum and reset at negative values,Sort array and return sum of positive numbers,Loop and track max difference,Compare pairs and store max sum', 
     'O(n),O(n^2),O(log n)', 
     'Consider a running total that resets when negative', 1, '1'), 

    (6, 
     'Medium', 
     'Binary Trees', 
     'Check if a binary tree is a valid binary search tree (BST).

Given the root of a binary tree, determine if it is a valid BST.

Example:
Input: root = [2,1,3]
Output: True

Input: root = [5,1,4,null,null,3,6]
Output: False

Constraints:
- The number of nodes in the tree is in the range [1, 10^4].', 
     'Tree,Graph,Array', 
     'Use in-order traversal and check sorted order,Use BFS to check each level,Convert to array and check sorted,Use recursion to check node bounds', 
     'O(n),O(n^2),O(log n)', 
     'An in-order traversal can be helpful here', 2, '1'), 

    (7, 
     'Medium', 
     'Dynamic Programming', 
     'Solve the coin change problem.

Given a target amount and a set of coin denominations, determine the minimum number of coins needed to make the amount.

Example:
Input: amount = 11, coins = [1,2,5]
Output: 3
Explanation: 11 = 5 + 5 + 1.

Constraints:
- 1 <= amount <= 10^4
- 1 <= coins.length <= 20.', 
     'Array,Tree,HashMap', 
     'Use a table to store subproblem solutions,Loop through all combinations,Use nested loops to build solutions,Convert denominations to graph nodes', 
     'O(n*m),O(2^n),O(n log n)', 
     'Think about storing solutions to subproblems', 2, '1'), 

    (8, 
     'Easy', 
     'Strings', 
     'Determine if a string is a palindrome.

Given a string s, determine if it reads the same backward as forward.

Example:
Input: s = "racecar"
Output: True

Input: s = "hello"
Output: False

Constraints:
- 1 <= s.length <= 10^5.', 
     'String,List,Array', 
     'Compare characters from both ends,Convert to list and sort,Use hash to store character counts,Compare all pairs of characters', 
     'O(n),O(n^2),O(log n)', 
     'Try comparing characters from the beginning and end simultaneously', 2, '1'), 

    (9, 
     'Medium', 
     'Sorting', 
     'Sort an array of 0s, 1s, and 2s in linear time.

Given an array nums of size n, sort the array such that 0s come first, followed by 1s, and then 2s.

Example:
Input: nums = [2,0,1]
Output: [0,1,2]', 
     'Array,List,Stack', 
     'Use three pointers for each value,Sort and then remove duplicates,Loop and swap at each index,Track each element with a stack', 
     'O(n),O(n^2),O(log n)', 
     'Consider using three pointers to organize the values', 2, '1'), 

    (10, 
     'Hard', 
     'Recursion', 
     'Generate all valid combinations of n pairs of parentheses.

Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.

Example:
Input: n = 3
Output: ["((()))","(()())","(())()","()(())","()()()"]', 
     'String,Array,Tree', 
     'Use recursion with open/close counters,Generate all combinations and filter valid,Use two nested loops for each pair,Use stack to add and remove parentheses', 
     'O(2^n),O(n^2),O(log n)', 
     'A recursive approach may help manage each opening and closing bracket', 2, '1'), 

    (11, 
     'Hard', 
     'Graphs', 
     'Find the shortest path in a weighted graph.', 
     'Graph,Tree,List', 
     'Use Dijkstra’s algorithm with a priority queue,Convert to adjacency matrix and loop,Use DFS to find minimum path,Sort edges and traverse all nodes', 
     'O(V+E log V),O(V^2),O(log V)', 
     'Using a priority queue may improve efficiency on each node visit', 2, '1');

Select * from Question;
Select * from User_Question_History;
Select * from Account;



