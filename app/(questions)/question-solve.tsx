import { StyleSheet, View, Text, TouchableOpacity, } from "react-native";
import React from "react";
import {useEffect} from 'react';
import { Row, Col, Card, Container, Button} from "react-bootstrap";
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";

export default function QuestionSolveScreen() {
  const { question } = useLocalSearchParams(); // Retrieve question from route parameters
  const navigation = useNavigation();
  /*load sql answers into here*/
  const answers = [
    "ANS1",
    "ANS2",
    "ANS3",
    "ANS4"
  ]
  let correctAns = answers[0];
  const [revealed, setRevealed] = React.useState(false);  


  navigation.setOptions({
    headerTitle: "", // Hides the title
    headerBackVisible: true, // Shows the back button
  });


  function shuffle() {
    let currentIndex = answers.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [answers[currentIndex], answers[randomIndex]] = [
        answers[randomIndex], answers[currentIndex]];
    }
  }

  

  useEffect( ()=>{
  shuffle();
  },[]);

function revealMe(ansType:string){

  if(revealed)
  switch (ansType){
    case "correct":
      return{...styles.correct};
    default:
      return{...styles.incorrect};
  }

}

function Answer(correct:boolean){
  if(revealed == true){
    if(correct == true){
        return styles.correct
    }else{
      return styles.incorrect
    }
 }else{
  return styles.answerBox
 }
}

shuffle();




  return (
    <View style={styles.container}>
      <View style={{...styles.questionBox}}>
        <ScrollView>
          <Text style={styles.questionText}>{question}</Text>
        </ScrollView>
      </View>
      <View>
            <Row xs={2}>
              {answers.map((item, i)=> (
                  <View style={Answer((item == correctAns)? true : false)}
                  key={{item} + "-" + i}>
                    <TouchableOpacity 
                    onPress={() => setRevealed(true)}
                    >
                      {item}
                    </TouchableOpacity>
                  </View>
            ))}
          </Row>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  correct:{
    display: "flex",
    borderRadius:12,
    borderWidth: 1,
    backgroundColor: "#20F020",
    padding:5,
    margin:25,
  },
  incorrect:{
    display: "flex",
    borderRadius:12,
    borderWidth: 1,
    backgroundColor: "#F02020",
    padding:5,
    margin:25,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderWidth: 2,
  },
  questionText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  answerBox: {
    display: "flex",
    borderRadius:12,
    borderWidth: 1,
    backgroundColor: "#EFE7E7",
    padding:5,
    margin:25,
  },
  questionBox:{
    display: "flex",
    alignSelf:"flex-end",
    position:"absolute",
    top:"5%",
    height: "auto",
    width: "90%",
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: "#D7D7D7",
    padding: 5,
  }
});
