import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
    Button,
    Text,
    View,
    Modal,
    ScrollView,
    Dimensions, Alert, Image
} from 'react-native';
import {StatusBar} from "expo-status-bar";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import  MentionHashtagTextView  from  "react-native-mention-hashtag-text";
//img
import {Searchbar} from "react-native-paper";
import styled from "styled-components/native";
import Icon from "react-native-vector-icons/Ionicons";
import Swiper from "react-native-swiper";
import {Ionicons} from "@expo/vector-icons";

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
const ImageVIew=styled.View`
  flex-direction: row;
  width: 100%;
`

const Img=styled.Image`
  width: 100%;
  height: 350px;
  border-radius: 20px;
`
const MainArea=styled.View`
  justify-content: space-between;
`

const MainLogo=styled.Text`
  flex-direction: row;
  justify-content: space-between;
  background-color: white;
  display: flex;
  height: 50px;
  left: 10px;
`
const PlusFeed=styled.Button`
  color: white;
  margin-left: 200px;
`

const HeaderStyle=styled.View`
  background-color: white;
  height: 400px;
  top: 10px;
`
const HeaderText=styled.View`
  flex-direction: row;
  left: 10px;
`

const MainText=styled.View`
  flex-direction: row;
  height: 60px;
`

const UserImage=styled.Image`
  width: 45px;
  height: 45px;
  border-radius: 100px;
`

const UserId=styled.Text`
  color: black;
  font-weight: bold;
  font-size: 15px;
  margin-left: 10px;
`
const CtrgArea=styled.View`
  margin-left: 5px;
  background-color: lightgray;
  border-radius: 5px;
  top: 2px;
`
const CtgrText= styled.TouchableOpacity`
  margin: 3px 5px 3px 5px;
  color: white;
`

//ModalStyle
const ModalStyle=styled.Modal`
  
`
const PeedId=styled.Text`
  color: black;
  font-size: 15px;
  left: 7px;
`

const ImagePrint=styled.Image`
  width: 100%;
  height: 300px;
  justify-content: center;
  align-items: center;
`

const TextArea=styled.View`
  background-color: white;
  flex-direction: row;
  top: -5px;
  width: 100%;
`


const LikeMent=styled.Text`
  flex-direction: row;
  color: black;
  margin-left: 10px;
  width: 100%;
`

const LikeArea=styled.View`
  flex-direction: row;
`
const ReplyArea=styled.View`
  flex-direction: row;
`
const DataArea=styled.View`
  
`

const BoldText1=styled.TouchableOpacity`
  font-weight: bold;
`
const BoldText2=styled.Text`
  font-weight: normal;
  top: 5px;
`
const ContentMent=styled.View`
  background-color: white;
  flex-direction: row;
  left: 10px;
`
const MentId=styled.Text`
  color: black;
  font-weight: bold;
  font-size: 15px;
`

const Ment = styled.Text`
  color: black;
  margin-left: 2%;
`

const HashTag=styled.Text`
  color: rgb(99,171,255);
`

const Wrapper = styled.View`
  flex: 1;
  background-color: white;
`;

const OptionArea = styled.View`
  flex-direction: row;
  position: relative;
`
//ModalStyle

const ModalArea = styled.View`
`

const CenteredView=styled.View`
  flex: 1;
  justify-content: flex-end;
  align-items: center;
`

const ModalView=styled.View`
  background-color: grey;
  border-radius: 20px;
  padding: 35px;
  align-items: center;
  opacity: 0.9;
  width: 100%;
`

const ModalText=styled.Text`
  font-weight: bold;
  text-align: center;
  color: white;
  font-size: 20px;
  margin: 15px;
  width: 90%;
`
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

//Img Slider
const ImgView = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

const ImgItem = styled.View`
  flex-direction: column;
  align-items: center;
`;

const ModalBtn=styled.View`
  font-size: 15px;
`

const FloatingButton = styled.TouchableOpacity`
  position: absolute;
  right: 20px;
  bottom: 94%;
  width: 30px;
  height: 30px;
  background-color: white;
  color: black;
  box-shadow: 1px 1px 3px gray;
  border: black solid 1px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  font-size: 10px;
`;
export default function PeedSelectPage(){

    const [text,onChangeText]=React.useState("");
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isPress, setIsPress] = React.useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [Home, setHome] = useState([{}]);
    const [mainImg, setmainImg] = useState([[{}]]);
    const [isModalVisible, setModalVisible] = useState(false);

    const [loading, setLoading] = useState(true);
    const [data,setData]=useState([]);

    const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
    const chartHeight = Dimensions.get('window').height;
    const chartWidth = Dimensions.get('window').width;

    const [isSelect, setSelect] = useState([false, false, false]);
    const [activeSection, setActiveSection] = useState([]);
    const [Search, setSearch] = useState([{}]);

    const [heartSelected, setHeartSelected] = useState<boolean>(false);
    //현재시간
    let today = new Date(); // today 객체에 Date()의 결과를 넣어줬다
    let time = {
        year: today.getFullYear(),  //현재 년도
        month: today.getMonth() + 1, // 현재 월
        date: today.getDate(), // 현제 날짜
        hours: today.getHours(), //현재 시간
        minutes: today.getMinutes(), //현재 분
    };
    let timestring = `${time.year}/${time.month}/${time.date}`;
    const getSearch = () => {
        const result = [];
        for (let i = 0; i < 4; ++i) {
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
    const mentionHashtagClick = (text) => {
        Alert.alert("Clicked to + " + text);
        /*navigate("HomeStack",{
            screen:"ReplyPage"
        })*/
    };
    return (
        <Container>
            <Wrapper>
                <ScrollView>
                    <MainArea>
                        <HeaderStyle>
                            <HeaderText>
                                <MainText>
                                    <UserImage source={{uri: 'https://i.pinimg.com/564x/9e/d8/4c/9ed84cf3fc04d0011ec4f75c0692c83e.jpg'}}/>
                                    <View>
                                        <UserId>이진규
                                        </UserId>
                                        <CtrgArea>
                                            <CtgrText>
                                                <Text>
                                                    온유프로젝트
                                                </Text></CtgrText>
                                        </CtrgArea>
                                    </View>
                                </MainText>
                            </HeaderText>
                            <Img
                                source={{uri: 'https://i.pinimg.com/564x/9e/d8/4c/9ed84cf3fc04d0011ec4f75c0692c83e.jpg'}}
                            />
                        </HeaderStyle>
                        <TextArea>
                            <LikeMent>
                                <LikeArea>
                                    <TouchableOpacity onPress={() => setHeartSelected(!heartSelected)}>
                                        {heartSelected ? (
                                            <TouchableOpacity >
                                                <Ionicons name="md-heart" size={24} color="red" />
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity >
                                                <Ionicons name="md-heart-outline" size={24} color="red"/>
                                            </TouchableOpacity>
                                        )}
                                    </TouchableOpacity>
                                </LikeArea>
                                <ReplyArea>
                                    <TouchableOpacity>
                                        <Icon name="md-chatbox-ellipses-outline" size={25} color='black'
                                              style={{ top: 2, left:5}}
                                        />
                                    </TouchableOpacity>
                                </ReplyArea>
                                <TouchableOpacity>
                                    <Icon name="md-share-outline" size={30} style={{
                                        marginLeft: 11,
                                        color: 'black',
                                        top: 2
                                    }}/>
                                </TouchableOpacity>
                                <DataArea>
                                    <Text style={{color: 'grey', left: 150}}>
                                        {timestring}
                                    </Text>
                                </DataArea>
                            </LikeMent>
                        </TextArea>
                        <ContentMent>
                            <Text>1</Text>
                        </ContentMent>
                        <HeaderStyle>
                            <HeaderText>
                                <MainText>
                                    <UserImage source={{uri: 'https://i.pinimg.com/564x/9e/d8/4c/9ed84cf3fc04d0011ec4f75c0692c83e.jpg'}}/>
                                    <View>
                                        <UserId>이진규
                                        </UserId>
                                        <CtrgArea>
                                            <CtgrText>
                                                <Text>
                                                    온유프로젝트
                                                </Text></CtgrText>
                                        </CtrgArea>
                                    </View>
                                </MainText>
                            </HeaderText>
                            <Img
                                source={{uri: 'https://i.pinimg.com/564x/9e/d8/4c/9ed84cf3fc04d0011ec4f75c0692c83e.jpg'}}
                            />
                        </HeaderStyle>
                        <TextArea>
                            <LikeMent>
                                <LikeArea>
                                    <TouchableOpacity onPress={() => setHeartSelected(!heartSelected)}>
                                        {heartSelected ? (
                                            <TouchableOpacity >
                                                <Ionicons name="md-heart" size={24} color="red" />
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity >
                                                <Ionicons name="md-heart-outline" size={24} color="red"/>
                                            </TouchableOpacity>
                                        )}
                                    </TouchableOpacity>
                                </LikeArea>
                                <ReplyArea>
                                    <TouchableOpacity>
                                        <Icon name="md-chatbox-ellipses-outline" size={25} color='black'
                                              style={{ top: 2, left:5}}
                                        />
                                    </TouchableOpacity>
                                </ReplyArea>
                                <TouchableOpacity>
                                    <Icon name="md-share-outline" size={30} style={{
                                        marginLeft: 11,
                                        color: 'black',
                                        top: 2
                                    }}/>
                                </TouchableOpacity>
                                <DataArea>
                                    <Text style={{color: 'grey', left: 150}}>
                                        {timestring}
                                    </Text>
                                </DataArea>
                            </LikeMent>
                        </TextArea>
                        <ContentMent>
                            <View>
                               <Text>2</Text>
                            </View>
                        </ContentMent>
                    </MainArea>
                </ScrollView>
            </Wrapper>
        </Container>
    )
}
