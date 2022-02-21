import React from 'react';
import {View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, Button} from 'react-native';
import styles from '../screens/css/SearchStyle'
import {StatusBar} from "expo-status-bar";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Account from './headerTab/Account'
import Group from './headerTab/Group'
//img
import logo from '../screens/img/logo.png'
import img from '../screens/img/unnamed.jpeg'
import han from '../screens/img/hangang.jpeg'
import IU from '../screens/img/iu.jpeg'
import IU2 from '../screens/img/123.jpg'
import IU3 from '../screens/img/IU.jpg'
import {useFonts} from "expo-font";
import AppLoading from "expo-app-loading";
import {Searchbar} from "react-native-paper";
import GridImageView from "react-native-grid-image-viewer";

export default function Club({navigation}){

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
    const Stack = createNativeStackNavigator();
    const onChangeSearch = query => setSearchQuery(query);

    return(
        <SafeAreaView>
            <StatusBar style="auto"/>
            <View style={styles.screen}>
                <View style={styles.header}>
                    <Searchbar
                        style={styles.input}
                        placeholder="Search..."
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                    />
                    <Button color="white" title='검색'/>
                </View>
                <View style={styles.tabHeader}>
                    <TouchableOpacity style={styles.tab} >
                        <Text style={styles.tabName} color="white"
                            onPress={()=>navigation.navigate('Account')}
                        >계정</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab}>
                        <Text style={styles.tabName}
                            onPress={()=>navigation.navigate('Group')}
                        >모임</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab}>
                        <Text style={styles.tabName}>카테고리</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab}>
                        <Text style={styles.tabName}>해시태그</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.body} contentContainerStyle={{alignItems: 'center'}}>
                    <View style={styles.imgView}>
                        <Image
                            style={styles.img}
                            source={han}
                        />
                        <Image
                            style={styles.img}
                            source={han}
                        />
                        <Image
                            style={styles.img}
                            source={han}
                        />
                        <Image
                            style={styles.img}
                            source={han}
                        />
                        <Image
                            style={styles.img}
                            source={han}
                        />
                        <Image
                            style={styles.img}
                            source={han}
                        />
                        <Image
                            style={styles.img}
                            source={han}
                        />
                    </View>
                    </ScrollView>
            </View>
        </SafeAreaView>
    )
}
