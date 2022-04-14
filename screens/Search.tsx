import React, {useState} from 'react';
import {StyleSheet, View, Text, Image,FlatList ,SafeAreaView, TouchableOpacity} from 'react-native';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import styled from "styled-components/native";

import SearchHeader from "./SearchPage/SearchHeader";
import IntroduceGroup from '../screens/SearchPage/IntroduceGroup'
import Peed from '../screens/SearchPage/Peed'

const NativeStack = createNativeStackNavigator();
const TopTab = createMaterialTopTabNavigator();

const Wrapper = styled.View`
  flex: 1;
`;


const SearchGroup=styled.View`
  display: flex;
  flex-direction: row;
  text-align: center;
  justify-content: center;
  margin: 1px;
`

const GroupText=styled.Text`
  display: flex;
  text-align: center;
  justify-content: center;
  top: 250px;
  color: red;
  font-size: 20px;
`

const GroupImage=styled.Image`
  width: 130px;
  height: 110px;
  margin: 1px;
`

const SearchArea=()=>(
    <SearchHeader/>
)

const ClubHome = () => (
    <IntroduceGroup/>
);

const Feed = () => (
    <Peed/>
);

const ClubHomeTopTabs=()=>{
    return (
        <TopTab.Navigator
            initialRouteName="ClubHome"
            screenOptions={{ swipeEnabled: true
            }}
        >
            <TopTab.Screen
                options={{ title: "최근검색어" }}
                name="ClubHome"
                component={ClubHome}
            />
            <TopTab.Screen
                options={{ title: "피드" }}
                name="Feed"
                component={Feed} />
        </TopTab.Navigator>
    );
}

const Search = () => {
    return (
        <NativeStack.Navigator>
            <NativeStack.Screen
                name="여기다가 어떻게 검색창 넣지"
                component={ClubHomeTopTabs}
                options={{
                    headerShown: false,
                }}
            />
        </NativeStack.Navigator>
    );
};
export default Search;