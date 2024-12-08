import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { useAppContext } from "../../../AppContext"; //To get accountID

type RouteParams = {
  questionID: number;
};

export default function QuestionSolveScreen() {
  const route = useRoute();
  const { questionID } = route.params as RouteParams;
  const { accountID } = useAppContext(); //Get accountID for use

  //Set variables for questions, answers, revealing the answer, correct answer, the user's selected answer, difficulty, and topic.
  const [revealed, setRevealed] = useState(false);
  const [question, setQuestion] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hint, setHint] = useState<string>("");
  const [revealedHint, setRevealedHint] = useState(false);
  const [hintUsed, setHintUsed] = useState<boolean>(false);
  const [bookmarked, setBookmarked] = useState<boolean>(false);

  //To get the details of the question
  const getQuestionInfo = async () => {
    try {
      const response = await fetch(
        `http://192.168.x.x:3000/api/question/${questionID}`
      );
      if (response.ok) {
        const data = await response.json();
        setQuestion(data.Question_Text); //Set the question text
        setCorrectAnswer(data.answers[0]); //First answer in DS_Q attribute is always correct
        setAnswers(shuffle(data.answers)); //Shuffle the answer order
        setDifficulty(data.Difficulty); //Set difficulty
        setTopic(data.Topic); //Set Topic
        setHint(data.Hints); //Set Hint
      } else {
        Alert.alert("ERROR: Failed to get question info"); //Error message if couldn't get question info
      }
    } catch (error) {
      //General Error Messages
      console.error("ERROR: Could not get question info:", error);
      Alert.alert("ERROR. Failed to load the question. Please attempt again.");
    }
  };

  //Shuffle the answers into random order
  const shuffle = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  //Function to check if the question is already bookmarked by the user
  const checkBookmarkStatus = async () => {
    try {
      const response = await fetch(
        "http://192.168.x.x:3000/api/user/check-bookmark",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accountID, questionID }),
        }
      );
      if (response.ok) {
        const data = await response.json(); //Get response
        setBookmarked(data.bookmarked); //Set the bookmark's status
      } else {
        Alert.alert("ERROR: Failed to check bookmark status"); //If could not get bookmark status.
      }
    } catch (error) { //General error messages
      console.error("ERROR: Could not check bookmark status:", error);
      Alert.alert("ERROR: Could not check bookmark status. Please attempt again.");
    }
  };

  //Function to toggle the bookmark status from bookmark to unbookmark
  const toggleBookmark = async () => {
    try {
      //Toggle the bookmark status
      const newBookmarkStatus = bookmarked ? "No" : "Yes";
      setBookmarked(!bookmarked); //Set the bookmark status
  
      //only updating the bookmark field
      const response = await fetch("http://192.168.x.x:3000/api/user/history/update-bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountID,
          questionID,
          bookmarked: newBookmarkStatus, //Change the bookmark status
          difficulty,
          topic,
        }),
      });
  
      if (!response.ok) {
        Alert.alert("ERROR: Failed to update bookmark status"); //If could not update status of bookmark
      }
  
      const result = await response.json(); //Get response

      if (result.message === "Bookmark updated") {//If message matches, then its successful
        console.log("Bookmark updated successfully");

        if (newBookmarkStatus === "Yes") {//Show success message to users.
          Alert.alert("Success", "Question successfully bookmarked!");
        } else {
          Alert.alert("Success", "Question successfully unbookmarked");
        }
      }
    } catch (error) { //General error messages.
      console.error("ERROR: Could not update bookmark:", error);
      Alert.alert("ERROR: Could not update bookmark status.");
    }
  };

  //Function to handle the hint view
  const handleViewHint = async () => {
    try {
      setRevealedHint(!revealedHint); //Set the hint visibility

      //Update the hint status if it hasn't been used yet
      if (!hintUsed) {
        setHintUsed(true); //The hint has been used

        const response = await fetch(
          "http://192.168.x.x:3000/api/user/history/update-hint",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              accountID,
              questionID,
              hintUsed: "Yes", //Hint was used
              difficulty,
              topic,
            }),
          }
        );

        if (!response.ok) { //If could not update hint was used.
          Alert.alert("ERROR: Failed to update hint usage.");
        }
      }
    } catch (error) { //General error messages.
      console.error("ERROR: Could not update hint usage:", error);
      Alert.alert("ERROR: Could not update hint usage.");
    }
  };  

  //To update the user question history for when a user attempts a question (again or for the first time)
  const updateUserHistory = async (isCorrect: boolean) => {
    try {
      const checkResponse = await fetch(
        `http://192.168.x.x:3000/api/user/history/check`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accountID, questionID }), //Send accountID and questionID to search for that question in the history
        }
      );

      if (!checkResponse.ok) {
        Alert.alert("ERROR: Failed to get question info"); //Error message if couldn't get question info
      }

      const checkHistory = await checkResponse.json();
      const historyInfo = {
        accountID,
        questionID,
        difficulty,
        topic,
        lastAttemptPASSFAIL: isCorrect,
        hintUsed: hintUsed ? "Yes" : "No",
        bookmarked: bookmarked ? "Yes" : "No",
      };

      if (checkHistory.exists) {
        //If the user has attempted the question before, then update that question's history info
        const updateResponse = await fetch(
          "http://192.168.x.x:3000/api/user/history/update",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              accountID: accountID,
              questionID: questionID,
              difficulty: difficulty,
              topic: topic,
              lastAttemptPASSFAIL: isCorrect,
              hintUsed: hintUsed ? "Yes" : "No",
              bookmarked: bookmarked ? "Yes" : "No",
            }), //Send all info to update that question entry in the user history question database
          }
        );

        if (!updateResponse.ok) {
          Alert.alert("ERROR: Failed to update user's history"); //Error message if could not update user history
        }

        const updateResult = await updateResponse.json();
      } else {
        //This is the user's first attempt at the question, so insert a new question history record
        const insertResponse = await fetch(
          "http://192.168.x.x:3000/api/user/history/insert",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(historyInfo), //Send the info to input into a new question record for the user
          }
        );

        if (!insertResponse.ok) {
          Alert.alert("ERROR: Failed to insert user's history"); //Error message if could not insert user history
        }
      }
    } catch (error) {
      console.error("ERROR: Could not update user history:", error); //General error messages
      Alert.alert(
        "ERROR: Could not update user history. Please attempt again."
      );
    }
  };

  //To handle what answer the user chooses
  const handleAnswer = async (selectedAnswer: string) => {
    const isCorrect = selectedAnswer === correctAnswer; //Determines whether the user's answer matches the correct answer and stores the truth value
    setSelectedAnswer(selectedAnswer);
    setRevealed(true); //Reveals the answer

    //Updates the user question history for whichever answer is chosen
    await updateUserHistory(isCorrect);

    //Message to indicate to the user if they answered correctly or incorrectly
    if (isCorrect) {
      Alert.alert("Correct!", "Good job!");
    } else {
      Alert.alert("Incorrect!", "Try again.");
    }
  };

  useEffect(() => {
    getQuestionInfo();
    checkBookmarkStatus();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
      <View style={styles.questionBox}>
        <ScrollView>
          <Text style={styles.questionText}>{question}</Text>
        </ScrollView>
      </View>
      
      <View style={styles.interactionBar}>
        <TouchableOpacity
          style={[
            styles.interactionButton,
            bookmarked ? styles.bookmarkedButton : null,
          ]}
          onPress={toggleBookmark}
        >
          <Text>{bookmarked ? "Unbookmark" : "Bookmark"}</Text>
        </TouchableOpacity>
      </View>
      <View>
        {answers.map((answer, i) => (
          <TouchableOpacity
            key={`${answer}-${i}`}
            style={
              revealed
                ? answer === selectedAnswer //Reveals selected answer
                  ? answer === correctAnswer //Reveals correct answer
                    ? styles.correct
                    : styles.incorrect
                  : styles.answerBox //Keeps other choices not colored
                : styles.answerBox
            }
            onPress={() => handleAnswer(answer)}
          >
            <Text>{answer}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* hint section */}
      <View style={styles.interactionBar}>
        <TouchableOpacity
          style={styles.interactionButton}
          onPress={handleViewHint}
        >
          <Text>View Hint</Text>
        </TouchableOpacity>
      </View>
      <View style={revealedHint ? styles.questionBox : styles.hide}>
        <Text>{hint || "No hint available"}</Text>
      </View>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  interactionBar: {
    display: "flex",
    width: "90%",
    flexDirection: "row-reverse",
    marginVertical: 10,
  },
  interactionButton: {
    width: 100,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#D7D7D7",
    fontSize: 16,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  bookmarkedButton: {
    backgroundColor: "gold", // Change color to gold when bookmarked
  },
  questionBox: {
    width: "90%",
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#D7D7D7",
    borderRadius: 10,
    borderWidth: 1,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  answerBox: {
    width: "80%",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#EFE7E7",
    borderRadius: 5,
    alignItems: "center",
  },
  correct: {
    backgroundColor: "#20F020",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 5,
  },
  incorrect: {
    backgroundColor: "#F02020",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 5,
  },
  hide: {
    display: "none",
  },
});
