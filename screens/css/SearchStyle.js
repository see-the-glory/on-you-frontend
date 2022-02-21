import React from 'react';
import {Dimensions, StyleSheet} from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles=StyleSheet.create({
    header:{
        flexDirection: "row"
    },
    screen:{
        backgroundColor: 'black',
        height: windowHeight,
        width: windowWidth
    },
    img:{
        width: 130,
        height: 100,
    },
    input:{
        width: windowWidth-50,
        borderWidth: 1,
        // backgroundColor: 'white',

    },
    tabHeader:{
        flexDirection: "row",
        justifyContent: "space-between",
        borderWidth: 1,
    },
    tabName:{
        fontSize:20,
        margin: 5,
        color: "white"
    },
    body:{
        width: windowWidth,
        flexDirection: "row",
    },
    imgView:{
         flexDirection: "row",
        // justifyContent: "space-between",
        width: windowWidth,
    },
})

export default styles;