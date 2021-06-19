import React from 'react';
import { Text, View, FlatList, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import db from '../config'
import { ScrollView } from 'react-native-gesture-handler';



export default class ReadStory extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        books: [],
        lastVisibleBook: null,
        search:''
      }
    }

    retrieveStories = async ()=>{
      var text = this.state.search.toUpperCase()

      const query = await db.collection("OwnStory").where('title','==',text).get();
      query.docs.map((doc)=>{
        this.setState({
          books: [...this.state.books,doc.data()],
          lastVisibleBook: doc
        })
      })
    }

    searchBooks= async(text) =>{
      var enteredText = text.split("")
      var text = this.state.search.toUpperCase()
  
      if (enteredText[0]){
        const book =  await db.collection("OwnStory").where('title','==',text).get();
        book.docs.map((doc)=>{
          this.setState({
            books:[...this.state.books,doc.data()],
            lastVisibleBook: doc
          })
        })
      }
      
    }

    componentDidMount = async ()=>{
      const query = await db.collection("OwnStory").limit(10).get()
      query.docs.map((doc)=>{
        this.setState({
          books: [...this.state.books,doc.data],
          lastVisibleBook: doc
        })
      })
    }
    render() {
      return (
        
        <View style={styles.container}>
          <View style={styles.searchBar}>
        <TextInput 
          style ={styles.bar}
          placeholder = "Enter Story Name"
          onChangeText={(text)=>{this.setState({search:text})}}/>
          <TouchableOpacity
            style = {styles.searchButton}
            onPress={()=>{this.searchBooks(this.state.search)}}
          >
            <Text>Search</Text>
          </TouchableOpacity>

          

          </View>
        <FlatList
          data={this.state.books}
          renderItem={({item})=>(
            <View style={{borderBottomWidth: 2}}>
              <Text>{"Story"+item.title}</Text>
              
            </View>
          )}
          keyExtractor= {(item, index)=> index.toString()}
          onEndReached ={this.retrieveStories}
          onEndReachedThreshold={0.7}
        /> 
        </View>
      );
    }
  }


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 20,
      backgroundColor:'#FADBD8'
    },
    searchBar:{
      flexDirection:'row',
      height:40,
      width:'auto',
      borderWidth:0.5,
      alignItems:'center',
      backgroundColor:'#E74C3C',
      
    },
    bar:{
      borderWidth:2,
      height:30,
      width:300,
      paddingLeft:10,
    },
    searchButton:{
      borderWidth:1,
      height:30,
      width:50,
      alignItems:'center',
      justifyContent:'center',
      backgroundColor:'#F1C40F'
    },

    
  })