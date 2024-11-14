import React from 'react';
import {View, ScrollView, Text, TouchableOpacity} from 'react-native'
import { Image, StyleSheet, Platform } from 'react-native';
import { useRouter, useNavigation } from "expo-router";
import { TextInput } from 'react-native-gesture-handler';
import {Dropdown, DropdownButton, DropdownMenu} from 'react-bootstrap'

/*how to get this information out of here and into database?*/ 

export default function HomeScreen() {

  const [question, setQuestion] = React.useState('');
  const [hint, setHint] = React.useState('');
  const [answerList, setAns] = React.useState([""]);
  const [difficulty, setDifficulty] =React.useState('')

  const difficultyList = [
    "Easy",
    "Normal",
    "Hard"
  ];
  
  const navigation = useNavigation();
  navigation.setOptions({
    headerTitle: "", // Hides the title
    headerBackVisible: false, // Shows the back button
  });

  /*dropdown menu contents*/
  const formats = ["MRQ", "Write In"]

  let currFormat=formats[0];



  function hideMe(){
    if (currFormat!="MRQ"){
        return styles.gtfo
    }
  }

  {/*replace one element in the array with the newly typed string */}
  function writeToArray(newStr:string, index:number){
    let newList = answerList.map((item, i)=>{
      if(i == index){
        return newStr;
      }else{
        return item;
      }
    }
  );
    setAns(newList)
  }

  /*remove answer from list*/
  function removeFromArray(index:number){
    const newArr = [...answerList];
    newArr.splice(index, 1)
    setAns(newArr)
  }

  return (
    
    <ScrollView>
      <View style={styles.container}>

        {/*question section*/}
        <View style={styles.section} >
        <Text style={styles.header}>Question</Text>
        <TextInput
        multiline
        style={styles.roundedBox}
        onChangeText={setQuestion}
        value={question}
        placeholder='Write question...'
        />
        </View>

        {/*hint section */}
        <View style={styles.section}>
          <Text style={styles.header}>Hint</Text>
        <TextInput
        multiline
        style={styles.roundedBox}
        onChangeText={setHint}
        value={hint}
        placeholder='Write hint...'
        />
        </View>

        {/*answer section*/}
        {/*hides if format is not MRQ */}
        <ScrollView style={{...hideMe(), ...styles.section}}>
        <Text style={styles.header}>Answers</Text>
          <View>

          {/*create a <ul> element for each item in array*/}
          {answerList.map((item, i)=>(
            <View key={"ans-"+i} style={styles.answer}>
              
                <TextInput
                style={styles.roundedBox}
                onChangeText={text => writeToArray(text, i)}
                value={answerList[i]}
                placeholder='Write answer...'
                />
              
              <TouchableOpacity
                style = {{...styles.roundedBox,...styles.trash}}
                onPress={() => removeFromArray(i)}>
              X</TouchableOpacity>
            </View>
          ))}
          </View>

          {/*combine styles like this*/}
        <TouchableOpacity style={{...styles.addButton, ...styles.roundedBox}}
        onPress={() => {setAns([...answerList, ""]);}}>+ add answer</TouchableOpacity>
        </ScrollView>
        
        <View style={styles.section}>
          <Text style={styles.header}>Difficulty</Text>
          <Dropdown>
            <Dropdown.Toggle>
              Select Difficulty...
            </Dropdown.Toggle>
            
            <Dropdown.Menu >
            {difficultyList.map((item, i)=>(
              <Dropdown.Item  key={item}>
                <TouchableOpacity
                onPress={() => {setDifficulty(item)}}>
                {difficultyList[i]}
                </TouchableOpacity>
              </Dropdown.Item>
            ))}
            </Dropdown.Menu>
          </Dropdown>
        </View>
        
      </View> 
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  overlay:{
    position:"absolute",
  },
  gtfo:{
    display:"none"
  },
  container:{
    margin:12,
  },
  section:{
    marginBottom:20,
  },
  addButton:{
    width:120 
  },
  answer:{
    margin:3,
    display:'flex',
    flexDirection: 'row',
  },
  trash:{
    backgroundColor:'#EF2424',
    color:'#EEEEEE',
    width:44,
    height:44,
    top:'50%'
  },
  roundedBox:{
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#D4D4D4',
    display:"flex"
  },
  dropdown:{
    borderWidth: 2,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
  },
  dropdownElement:{
    marginBottom: 4,
    color: "#000000"
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "left",
  },
});
