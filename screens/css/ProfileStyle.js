import React from 'react';
import {Dimensions, StyleSheet} from "react-native";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles=StyleSheet.create({
    screen:{
        backgroundColor: 'black',
        height: windowHeight
    }
    ,profile:{
        width: 150,
        height: 150,
        borderRadius:100,
        top: 40,
        left: 20

    },
    header:{
        flexDirection: 'row'
    },
    profileImg:{

    }
    ,profileText:{
        flexDirection: "column",
        left: 40,
        top: 40
    },
    content:{
        color: "white",
        marginTop: 10,
        fontSize: 20
    },
    interest:{
      position: "relative",
        top: 100
    },
    interestTitle:{
        color: "white",
        fontSize: 30
    },
    interestList:{
        color: 'white',
        top: 10,
        fontSize: 20,
        marginTop: 20
    }
    ,myGroup:{
        top: 200
    }

})
export default styles;