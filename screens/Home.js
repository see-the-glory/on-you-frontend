import React, {useEffect, useState} from 'react';
import {Animated,ScrollView,Dimensions,SafeAreaView,StyleSheet,View, Text,Image,TextInput,TouchableOpacity} from 'react-native';
import {StatusBar} from "expo-status-bar";
import {useFonts} from "expo-font";
import * as Font from "expo-font";
import AppLoading from 'expo-app-loading';
//img
import logo from '../screens/img/logo.png'
import img from '../screens/img/unnamed.jpeg'
import han from '../screens/img/hangang.jpeg'
import IU from '../screens/img/iu.jpeg'
import IU2 from '../screens/img/123.jpg'
import IU3 from '../screens/img/IU.jpg'

import {Ionicons} from "@expo/vector-icons";
import Icon from 'react-native-vector-icons/Ionicons'
import { Searchbar } from 'react-native-paper';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import styles from '../screens/css/Style'

export default function Home(){
    const [text,onChangeText]=React.useState("");
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isPress, setIsPress] = React.useState(true);

    const [loaded]= useFonts({
        Quintessential: require('../assets/fonts/Quintessential-Regular.ttf'),
        billabong: require('../assets/fonts/billabong.otf'),
        dancing: require('../assets/fonts/DancingScript-VariableFont.ttf'),
        satisfy: require('../assets/fonts/Satisfy-Regular.ttf'),
    })
    if (!loaded) {
        return <AppLoading />;
    }

    const onChangeSearch = query => setSearchQuery(query);

    return(
        <SafeAreaView>
            <StatusBar style="auto"/>
            <ScrollView style={styles.screen}>
            {/*    11*/}
            <View>
            <View style={styles.home}>
                <View style={styles.header}>
                    {/*<Image style={styles.logo} source={logo}/>*/}
                    <Text style={{
                              color:'white',
                              fontSize: 40,
                                fontWeight: "bold",
                              fontFamily: 'satisfy'
                          }}>OnYou</Text>
                </View>
            </View>
                <View style={styles.body}>
                    <View style={styles.title}>
                        <Image style={styles.profile} source={logo}/>
                        <Text style={styles.id}>GyuBin</Text>
                        <TouchableOpacity>
                            <Icon name="ellipsis-horizontal" size={30} style={{
                                marginLeft: 250,
                                color: 'white',
                                top: 10
                            }}/>
                        </TouchableOpacity>

                    </View>
                    <Image
                        style={styles.img}
                        source={han}
                    />
                </View>
                <View>
                   {/* <TouchableOpacity>
                        <Icon name="heart-outline" size={30} style={styles.heart} />
                    </TouchableOpacity>*/}
                    <View style={styles.icon}>
                        <TouchableOpacity>
                            <Icon name="heart-outline" size={30} style={styles.heart} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Icon name="chatbubble-outline" size={30} style={styles.heart} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Icon name="paper-plane-outline" size={30} style={styles.heart} />
                    </TouchableOpacity>
                        {/*<TouchableOpacity>
                            <Icon name="bookmark-outline" size={30} style={styles.boormark} />
                    </TouchableOpacity>*/}
                    </View>
                </View>
                 <View style={styles.likeArea}>
                     <Image
                         style={styles.likePeople}
                         source={han}/>
                     <Image
                         style={styles.likePeople}
                         source={han}/>
                     <Image
                         style={styles.likePeople}
                         source={han}/>
                     <Text style={styles.likeMent}>
                         <Text style={styles.likeId}>GyuBin</Text>님 외 <Text style={styles.likeId}>192</Text>명이 좋아합니다
                     </Text>
                 </View>
                    <View style={styles.PhotoMent}>
                        <Text style={styles.mentId}>GyuBin</Text>
                        <Text style={styles.ment}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. </Text>
                    </View>
                <View>
                    <TouchableOpacity >
                        <Text  style={styles.comment}>
                            댓글 10,938개 모두 보기
                    </Text>
                    </TouchableOpacity>
                </View>
                </View>

            {/*22*/}
                <View>
                <View style={styles.body}>
                    <View style={styles.title}>
                        <Image style={styles.profile} source={logo}/>
                        <Text style={styles.id}>GyuBin</Text>
                        <TouchableOpacity>
                            <Icon name="ellipsis-horizontal" size={30} style={{
                                marginLeft: 250,
                                color: 'white',
                                top: 10
                            }}/>
                        </TouchableOpacity>

                    </View>
                    <Image
                        style={styles.img}
                        source={IU}
                    />
                </View>
                <View>
                    {/* <TouchableOpacity>
                        <Icon name="heart-outline" size={30} style={styles.heart} />
                    </TouchableOpacity>*/}
                    <View style={styles.icon}>
                        <TouchableOpacity>
                            <Icon name="heart-outline" size={30} style={styles.heart} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Icon name="chatbubble-outline" size={30} style={styles.heart} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Icon name="paper-plane-outline" size={30} style={styles.heart} />
                        </TouchableOpacity>
                       {/* <TouchableOpacity>
                            <Icon name="bookmark-outline" size={30} style={styles.boormark} />
                        </TouchableOpacity>*/}
                    </View>
                </View>
                <View style={styles.likeArea}>
                    <Image
                        style={styles.likePeople}
                        source={han}/>
                    <Image
                        style={styles.likePeople}
                        source={han}/>
                    <Image
                        style={styles.likePeople}
                        source={han}/>
                    <Text style={styles.likeMent}>
                        <Text style={styles.likeId}>GyuBin</Text>님 외 <Text style={styles.likeId}>192</Text>명이 좋아합니다
                    </Text>
                </View>
                <View style={styles.PhotoMent}>
                    <Text style={styles.mentId}>GyuBin</Text>
                    <Text style={styles.ment}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. </Text>
                </View>
                    <View>
                        <TouchableOpacity >
                            <Text  style={styles.comment}>
                                댓글 10,938개 모두 보기
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

            {/*  33  */}
                <View>
                <View style={styles.body}>
                    <View style={styles.title}>
                        <Image style={styles.profile} source={logo}/>
                        <Text style={styles.id}>GyuBin</Text>
                        <TouchableOpacity>
                            <Icon name="ellipsis-horizontal" size={30} style={{
                                marginLeft: 250,
                                color: 'white',
                                top: 10
                            }}/>
                        </TouchableOpacity>
                    </View>
                    <Image
                        style={styles.img}
                        source={img}
                    />
                </View>
                <View>
                    <View style={styles.icon}>
                        <TouchableOpacity>
                            <Icon name="heart-outline" size={30} style={styles.heart} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Icon name="chatbubble-outline" size={30} style={styles.heart} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Icon name="paper-plane-outline" size={30} style={styles.heart} />
                        </TouchableOpacity>
                        {/*<TouchableOpacity>
                            <Icon name="bookmark-outline" size={30} style={styles.boormark} />
                        </TouchableOpacity>*/}
                    </View>
                </View>
                <View style={styles.likeArea}>
                    <Image
                        style={styles.likePeople}
                        source={han}/>
                    <Image
                        style={styles.likePeople}
                        source={han}/>
                    <Image
                        style={styles.likePeople}
                        source={han}/>
                    <Text style={styles.likeMent}>
                        <Text style={styles.likeId}>GyuBin</Text>님 외 <Text style={styles.likeId}>192</Text>명이 좋아합니다
                    </Text>
                </View>
                <View style={styles.PhotoMent}>
                    <Text style={styles.mentId}>GyuBin</Text>
                    <Text style={styles.ment}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. </Text>
                </View>
                    <View>
                        <TouchableOpacity >
                            <Text  style={styles.comment}>
                                댓글 10,938개 모두 보기
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/*44*/}
                <View>
                    <View style={styles.body}>
                        <View style={styles.title}>
                            <Image style={styles.profile} source={logo}/>
                            <Text style={styles.id}>GyuBin</Text>
                            <TouchableOpacity>
                                <Icon name="ellipsis-horizontal" size={30} style={{
                                    marginLeft: 250,
                                    color: 'white',
                                    top: 10
                                }}/>
                            </TouchableOpacity>

                        </View>
                        <Image
                            style={styles.img}
                            source={IU2}
                        />
                    </View>
                    <View>
                        <View style={styles.icon}>
                            <TouchableOpacity>
                                <Icon name="heart-outline" size={30} style={styles.heart} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Icon name="chatbubble-outline" size={30} style={styles.heart} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Icon name="paper-plane-outline" size={30} style={styles.heart} />
                            </TouchableOpacity>
                            {/*<TouchableOpacity>
                                <Icon name="bookmark-outline" size={30} style={styles.boormark} />
                            </TouchableOpacity>*/}
                        </View>
                    </View>
                    <View style={styles.likeArea}>
                        <Image
                            style={styles.likePeople}
                            source={han}/>
                        <Image
                            style={styles.likePeople}
                            source={han}/>
                        <Image
                            style={styles.likePeople}
                            source={han}/>
                        <Text style={styles.likeMent}>
                            <Text style={styles.likeId}>GyuBin</Text>님 외 <Text style={styles.likeId}>192</Text>명이 좋아합니다
                        </Text>
                    </View>
                    <View style={styles.PhotoMent}>
                        <Text style={styles.mentId}>GyuBin</Text>
                        <Text style={styles.ment}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. </Text>
                    </View>
                    <View>
                        <TouchableOpacity >
                            <Text  style={styles.comment}>
                                댓글 10,938개 모두 보기
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/*55*/}
                <View>
                    <View style={styles.body}>
                        <View style={styles.title}>
                            <Image style={styles.profile} source={logo}/>
                            <Text style={styles.id}>GyuBin</Text>
                            <TouchableOpacity>
                                <Icon name="ellipsis-horizontal" size={30} style={{
                                    marginLeft: 250,
                                    color: 'white',
                                    top: 10
                                }}/>
                            </TouchableOpacity>
                        </View>
                        <Image
                            style={styles.img}
                            source={IU3}
                        />
                    </View>
                    <View>
                        <View style={styles.icon}>
                            <TouchableOpacity>
                                <Icon name="heart-outline" size={30} style={styles.heart} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Icon name="chatbubble-outline" size={30} style={styles.heart} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Icon name="paper-plane-outline" size={30} style={styles.heart} />
                            </TouchableOpacity>
                            {/*<TouchableOpacity>
                                <Icon name="bookmark-outline" size={30} style={{
                                    color: "white",
                                    // marginLeft: Dimensions.get('window').width
                                    marginLeft: 260
                                }} />
                            </TouchableOpacity>*/}
                        </View>
                    </View>
                    <View style={styles.likeArea}>
                        <Image
                            style={styles.likePeople}
                            source={han}/>
                        <Image
                            style={styles.likePeople}
                            source={han}/>
                        <Image
                            style={styles.likePeople}
                            source={han}/>
                        <Text style={styles.likeMent}>
                            <Text style={styles.likeId}>GyuBin</Text>님 외 <Text style={styles.likeId}>192</Text>명이 좋아합니다
                        </Text>
                    </View>
                    <View style={styles.PhotoMent}>
                        <Text style={styles.mentId}>GyuBin</Text>
                        <Text style={styles.ment}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. </Text>
                    </View>
                    <View>
                        <TouchableOpacity >
                            <Text  style={styles.comment}>
                                댓글 10,938개 모두 보기
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

