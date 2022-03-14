import React from 'react';
import {ScrollView, TouchableOpacity, Button} from 'react-native';
import {StatusBar} from "expo-status-bar";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//img
import {Searchbar} from "react-native-paper";
import styled from "styled-components/native";

const Container = styled.SafeAreaView`
  position: relative;
  flex-direction: column;
  height: 100%;
`;

const Screen=styled.View`
  background: black;
  height: 1000px;
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
  color: white;
`
const ImageVIew=styled.View`
  flex-direction: row;
  width: 100%;
`

const Img=styled.Image`
  width: 130px;
  height: 110px;
`
export default function Search({navigation}){

    const [text,onChangeText]=React.useState("");
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isPress, setIsPress] = React.useState(true);

    const Stack = createNativeStackNavigator();
    const onChangeSearch = query => setSearchQuery(query);

    return(
        <Container>
            <StatusBar style="auto"/>
            <Screen>
                <Header>
                    <Searchbar
                        style={{width: "90%", borderWidth: 1}}
                        placeholder="Search..."
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                    />
                    <Button color="white" title='검색' />
                </Header>
                <TabHeader>
                    <TouchableOpacity>
                        <TabName
                            onPress={()=>navigation.navigate('Search')}
                        >모임</TabName>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <TabName>피드</TabName>
                    </TouchableOpacity>
            </TabHeader>

                <ScrollView contentContainerStyle={{alignItems: 'center'}}>
                    <ImageVIew>
                        <Img
                            source={{uri: 'https://i.pinimg.com/564x/1c/8d/cb/1c8dcbcfc2ad46940cf15a6ca32fd06c.jpg'}}
                        />
                        <Img
                            source={{uri: 'https://i.pinimg.com/564x/ae/b8/24/aeb8240c882d9f0365bf40af0082a2b6.jpg'}}
                        />
                        <Img
                            source={{uri: 'https://i.pinimg.com/564x/42/6c/a9/426ca96b3adec1511f4a28c583025543.jpg'}}
                        />
                    </ImageVIew>
                    </ScrollView>
            </Screen>
        </Container>
    )
}
