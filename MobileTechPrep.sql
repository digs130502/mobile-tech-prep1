-- Create a new database (only if it doesn't exist already)
CREATE DATABASE IF NOT EXISTS MobileTechPrep;

-- Select the database to use
USE MobileTechPrep;

-- 1. Create the Question Database
CREATE TABLE Question (
    QuestionID INT NOT NULL,
    Difficulty VARCHAR(50),
    Topic VARCHAR(100),
    Question_Name VARCHAR(100),
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

INSERT INTO Question (QuestionID, Difficulty, Topic, Question_Name, Question_Text, DS_Q, Pseudo_Q, TSC_Q, Hints)
VALUES 
    (6, 
     'Easy', 
     'Arrays', 
     'Two Sum', 
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
     'Consider an efficient lookup structure'),

    (7, 
     'Easy', 
     'Linked Lists', 
     'Reverse Linked List', 
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
     'Consider updating each node’s next pointer'),

    (8, 
     'Medium', 
     'Hashing', 
     'First Non-Repeating Character', 
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
     'Try storing character counts as you traverse the string'),

    (9, 
     'Hard', 
     'Graphs', 
     'Cycle Detection in Graph', 
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
     'Think about marking nodes during traversal'),

    (10, 
     'Easy', 
     'Arrays', 
     'Maximum Subarray Sum', 
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
     'Consider a running total that resets when negative'),

    (11, 
     'Medium', 
     'Binary Trees', 
     'Validate Binary Search Tree', 
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
     'An in-order traversal can be helpful here'),

    (12, 
     'Medium', 
     'Dynamic Programming', 
     'Coin Change Problem', 
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
     'Think about storing solutions to subproblems'),

    (13, 
     'Easy', 
     'Strings', 
     'Check Palindrome', 
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
     'Try comparing characters from the beginning and end simultaneously'),

    (14, 
     'Medium', 
     'Sorting', 
     'Sort 0s, 1s, and 2s', 
     'Sort an array of 0s, 1s, and 2s in linear time.

Given an array nums of size n, sort the array such that 0s come first, followed by 1s, and then 2s.

Example:
Input: nums = [2,0,1]
Output: [0,1,2]', 
     'Array,List,Stack', 
     'Use three pointers for each value,Sort and then remove duplicates,Loop and swap at each index,Track each element with a stack', 
     'O(n),O(n^2),O(log n)', 
     'Consider using three pointers to organize the values'),

    (15, 
     'Hard', 
     'Recursion', 
     'Generate Parentheses', 
     'Generate all valid combinations of n pairs of parentheses.

Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.

Example:
Input: n = 3
Output: ["((()))","(()())","(())()","()(())","()()()"]', 
     'String,Array,Tree', 
     'Use recursion with open/close counters,Generate all combinations and filter valid,Use two nested loops for each pair,Use stack to add and remove parentheses', 
     'O(2^n),O(n^2),O(log n)', 
     'A recursive approach may help manage each opening and closing bracket');


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
