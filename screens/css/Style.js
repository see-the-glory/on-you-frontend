import React from 'react';
import {Dimensions, StyleSheet} from "react-native";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import * as Font from 'expo-font'

const styles=StyleSheet.create({
    screen:{
        backgroundColor: 'black'
    }
    ,home:{
        backgroundColor: 'black'
    },
    header:{
        flexDirection: "row",
        justifyContent: "space-between",
        height: 50
        // backgroundColor: 'black'
    }
    ,logo:{
        width: 40,
        height: 40,
        // borderRadius: 10
    },
    logoText:{

    }
    ,search:{
        alignItems: "center",
        top: 10,
        right: 10,
        color: 'white'

    },
    input:{
        width: 250,
        borderWidth: 1,
        backgroundColor: 'white',
    },
    body:{
        backgroundColor: 'black'
    },
    title:{
        flexDirection: "row",
    },
    id:{
        color: 'white',height: 15, top: 15, left: 5
    }
    ,img:{
        width: windowWidth,
        height: 300,
        justifyContent: "center",
        alignItems: "center",
    },
    profile:{
        width: 50,
        height: 50,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        borderRadius: 50
    },
    heart:{
        color: "white"
    },
    boormark:{
        color: "white",
        marginLeft: windowWidth-130
    }
    ,like:{
        backgroundColor: "pink"
    },
    icon:{
        flexDirection: "row",
        justifyContent: 'flex-start',
        paddingLeft: 4
    },
    likeArea:{
        flexDirection: "row",
    }
    ,likePeople:{
        width: 20,
        height: 20,
        borderRadius: 50,
        zIndex: 1,
    },
    likeMent:{
        color: 'white',
        marginLeft: 10
    },
    likeId:{
        fontWeight: "bold"
    },
    PhotoMent:{
        flexDirection: "row",
    },
    mentId:{
        color: 'white',
        fontWeight: "bold",
        fontSize: 15
    },
    ment:{
        color: 'white',
        marginLeft: 10,
        width: 200
    },
    comment:{
        color: 'lightgrey',
        margin: 10
    }
})
export default styles;