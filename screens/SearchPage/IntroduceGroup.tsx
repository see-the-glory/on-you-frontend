import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList,TouchableOpacity, Button, Text} from 'react-native';
import {StatusBar} from "expo-status-bar";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//img
import {Searchbar} from "react-native-paper";
import styled from "styled-components/native";

const Wrapper = styled.View`
  flex: 1;
`;

const Container = styled.SafeAreaView`
  position: relative;
  flex-direction: column;
  height: 100%;
`;

const Screen=styled.View`
  background: white;
  height: 100%;
`

const Header=styled.View`
  flex-direction: row;
`
const TabHeader=styled.View`
    flex-direction: row;
    justify-content: space-around;
  border-width: 1px;
`
const TabName=styled.Text`
  font-size: 20px;
  margin: 5px;
  color: black;
`
const ImageScroll=styled.ScrollView`
  flex: 1;
  flex-direction: column;
  width: 100%;
`
const ImageVIew=styled.View`
  flex-direction: row;
  width: 100px;
`

const Img=styled.Image`
  width: 130px;
  height: 110px;
  margin: 1px;
`
export default function IntroduceGroup(){

    const [text,onChangeText]=React.useState("");
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isPress, setIsPress] = React.useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [Search, setSearch] = useState([{}]);
    const [data,setData]=useState();
    const Stack = createNativeStackNavigator();
    const onChangeSearch = query => setSearchQuery(query);

    const getSearch = () => {
        const result = [];
        for (let i = 0; i < 10; ++i) {
            result.push({
                /* id: i,
                 img:
                     "https://i.pinimg.com/564x/96/a1/11/96a111a649dd6d19fbde7bcbbb692216.jpg",
                 name: "문규빈",
                 content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
                 memberNum: Math.ceil(Math.random() * 10),*/
            });
        }

        setSearch(result);
    };
    const getData = async () => {
        await Promise.all([getSearch()]);
        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await getData();
        setRefreshing(false);
    };

    return (
        <Container>
            <StatusBar style="auto"/>
            <Text>최근검색어</Text>
            <Text>1. 퇴사를 2.하자 3.열심히</Text>
        </Container>
    )
}
