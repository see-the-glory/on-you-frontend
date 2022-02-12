import React from 'react';
import {Animated,ScrollView,Dimensions,SafeAreaView,StyleSheet,View, Text,Image,TextInput,TouchableOpacity} from 'react-native';
import logo from '../screens/img/logo.png'
import img from '../screens/img/unnamed.jpeg'
import han from '../screens/img/hangang.jpeg'
// import IU from '../screens/img/IMG_0854.JPG'

import {Ionicons} from "@expo/vector-icons";
import Icon from 'react-native-vector-icons/Ionicons'
import { Searchbar } from 'react-native-paper';
// import styles from '../css/App.css'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Home(){
    const [text,onChangeText]=React.useState("");
    const [searchQuery, setSearchQuery] = React.useState('');


    const onChangeSearch = query => setSearchQuery(query);
    return(
        <SafeAreaView>
            <ScrollView>
            <View style={styles.home}>
                <View style={styles.header}>
                    <Image style={styles.logo} source={logo}/>
                   {/* <Searchbar
                        style={styles.input}
                        placeholder="Search"
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                    />*/}
                    {/*<TextInput
                        style={styles.input}
                        onChangeText={onChangeText}
                        value={text}
                        placeholder="Search"
                    />*/}
                    <TouchableOpacity onPress={()=>styles.event}>
                        <Icon name="ios-search" size={30} style={styles.search} />
                    </TouchableOpacity>
                </View>
            </View>
                <View style={styles.body}>
                    <View style={styles.title}>
                        <Image style={styles.profile} source={logo}/>
                        <Text style={{color: 'black',height: 15, top: 15, left: 5
                        }}>GyuBin</Text>
                    </View>
                    <Image
                        style={styles.img}
                        source={img}

                    />
                </View>

            <View style={styles.home}>
                <View style={styles.body}>
                    <View style={styles.title}>
                        <Image style={styles.profile} source={logo}/>
                        <Text style={{color: 'black',height: 15, top: 15, left: 5
                        }}>GyuBin</Text>
                    </View>
                    <Image
                        style={styles.img}
                        source={han}

                    />
                </View>
            </View>

            <View style={styles.home}>
                <View style={styles.body}>
                    <View style={styles.title}>
                        <Image style={styles.profile} source={logo}/>
                        <Text style={{color: 'black',height: 15, top: 15, left: 5
                        }}>GyuBin</Text>
                    </View>
                    <Image
                        style={styles.img}
                        source={img}

                    />
                </View>
            </View>
            </ScrollView>
        </SafeAreaView>
    )
}
const styles=StyleSheet.create({
    home:{},
    header:{
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: 'black'
    }
    ,logo:{
        width: 50,
        height: 50,
        // borderRadius: 10
    },
    search:{
        alignItems: "center",
        top: 10,
        right: 10,
        color: 'white'
    },
    input:{
        width: 250,
        // margin: 5,
        borderWidth: 1,
        // padding: 6,
        // left: 100,
        backgroundColor: 'white',
        // display: 'none'
    },
    body:{

    },
    title:{
        flexDirection: "row",
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
    }


})

