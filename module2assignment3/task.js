import React from 'react';
import {View, Text, Stylesheet } from 'react-native' ;

const Task = (props) => { 

    return ( 
        <View style={styles.item}>
            <View style={styles.itemLeft}>
               <View style={styles.square}></View> 
                <Text style={styles.itemText}>{props.Text}</Text>
            </View>
            <View style={styles.circular}></View>
        </View>
    )
}

const styles = Stylesheet.create({
 
 item: {
    backgroundColor: #FFFFFF , 
    padding :15,
    borderRadius: 10, 
    flexDirection: 'row' ,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBotoom: 20,
  
 },
 itemLeft: {
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
 },
 square: {
    width: 24,
    height: 24,
    backgroundColor: '#55BCF6',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,

 },
 circular: {
    width: 12, 
    height: 12, 
    borderColor: '#55BCF6',
    borderWidth: 2,
    borderRadius: 5,
 },
 itemText: {
    maxWidth: '80%',
    
 },

});

export default Task;