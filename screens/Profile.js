import React from 'react';
import {View, Text, SafeAreaView, ScrollView, Image,TextInput, TouchableOpacity, Button} from 'react-native';
import styles from '../screens/css/ProfileStyle'
import {StatusBar} from "expo-status-bar";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {useFonts} from "expo-font";
import AppLoading from "expo-app-loading";
import logo from '../screens/img/logo.png'

export default function Profile(){
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
            <ScrollView>
                <View style={styles.screen}>
                    <View style={styles.header}>
                        {/*<Image style={styles.logo} source={logo}/>*/}
                        <Text style={{
                            color:'white',
                            fontSize: 40,
                            fontWeight: "bold",
                            fontFamily: 'satisfy'
                        }}>OnYou</Text>
                    </View>
                    <View style={styles.header}>
                        <View style={styles.profileImg}>
                            <Image style={styles.profile} source={logo}/>
                        </View>
                        <View style={styles.profileText}>
                            <Text style={styles.content}>이름: 문규빈</Text>
                            <Text style={styles.content}>성별: 남</Text>
                            <Text style={styles.content}>생년월일: 1995.09.23</Text>
                            <Text style={styles.content}>교회: 시광교회</Text>
                        </View>
                    </View>
                    <View style={styles.interest}>
                        <View>
                            <Text style={styles.interestTitle}>관심사</Text>
                        </View>
                        <View>
                            <Text style={styles.interestList}>독서</Text>
                            <Text style={styles.interestList}>코딩</Text>
                            <Text style={styles.interestList}>운동</Text>
                        </View>
                    </View>
                    <View style={styles.myGroup}>
                        <Text style={styles.interestTitle}>내가 속한 모임</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>

    )
}
