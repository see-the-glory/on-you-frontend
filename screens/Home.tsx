import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    FlatList,
    View,
    Text,
    TouchableOpacity,
    Button,
    Dimensions,
    TouchableWithoutFeedback, Alert
} from 'react-native';
import styled from "styled-components/native";
import Swiper from "react-native-swiper";
import Modal from "react-native-modal";
import {StatusBar} from "expo-status-bar";

import Icon from 'react-native-vector-icons/Ionicons'
import {Ionicons} from "@expo/vector-icons";

const Container = styled.SafeAreaView`
  position: relative;
  flex-direction: column;
  height: 100%;
`;
const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const Scroll = styled.ScrollView`
  background-color: black;
`

const MainArea=styled.View`
  justify-content: space-between;
`

const MainLogo=styled.Text`
  flex-direction: row;
  justify-content: space-between;
  background-color: white;
  display: flex;
`
const PlusFeed=styled.Button`
  color: white;
  margin-left: 200px;
`

const HeaderStyle=styled.View`
  background-color: white;
  height: 400px;
  margin-top: 10px;
`
const HeaderText=styled.Text`
  flex-direction: row;
  left: 5px;
`

const UserId=styled.TouchableOpacity`
  color: black;
  height: 25px;
  font-weight: bold;
  font-size: 15px;
`

//ModalStyle
const ModalStyle=styled.Modal`

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
  margin-top: 5px;
`
const LogoImage=styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 100px;
  z-index: 1;
`

const LikeImg=styled.Image`
  width: 20px;
  height: 20px;
  border-radius: 100px;
  z-index: 1;
`

const LikeMent=styled.Text`
  color: black;
  margin-left: 10px;
`
const BoldText1=styled.TouchableOpacity`
  font-weight: bold;
`
const BoldText2=styled.Text`
  font-weight: bold;
`
const ContentMent=styled.View`
  background-color: white;
  flex-direction: row;
`
const MentId=styled.TouchableOpacity`
  color: black;
  font-weight: bold;
  font-size: 15px;
`

const Ment = styled.Text`
  color: black;
  margin-left: 10px;
  width: 200px;
`

const Wrapper = styled.View`
  flex: 1;
  background-color: white;
`;
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

const ImgSource = styled.Image`
  width: 390px;
  height: 100%;
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
//Number
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const Home:React.FC<NativeStackScreenProps<any, "Home">> = ({
                                                                navigation: { navigate },
                                                            }) => {
    const [text,onChangeText]=React.useState("");
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isPress, setIsPress] = React.useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [Home, setHome] = useState([{}]);
    const [mainImg, setmainImg] = useState([[{}]]);
    const [isModalVisible, setModalVisible] = useState(false);

    const [loading, setLoading] = useState(true);
    const [data,setData]=useState();

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const goToProfile = () => {
        navigate("HomeStack",{
            screen:"Profile"
        })
    }

    const goToContent = () => {
        navigate("HomeStack",{
            screen:"ImageSelecter"
        })
    }

    const goToModifiy=()=>{
        navigate("HomeStack",{
            screen:"ModifiyPeed"
        })
        setModalVisible(!isModalVisible);
    }

    const CreateFeed=()=>{
        navigate("HomeStack",{
            screen:"CreateHomePeed"
        })
    }

    const goToAccusation=()=>{
        navigate("HomeStack",{
            screen:"Accusation"
        })
        setModalVisible(!isModalVisible);
    }

    const closeModal=()=>{
        setModalVisible(!isModalVisible);
    }

    const deleteCheck = () =>{
        Alert.alert(
            "게시글을 삭제하시겠어요?",
            "30일 이내에 내 활동의 최근 삭제 항목에서 이 게시물을 복원할 수 있습니다." +
            "30일이 지나면 영구 삭제 됩니다. ",
            [
                {
                    text: "아니요",
                    onPress: () => console.log(""),
                    style: "cancel"
                },
                { text: "네", onPress: () => Alert.alert("삭제되었습니다.") },
            ],
            { cancelable: false },
        );
        setModalVisible(!isModalVisible);
    }




    const getHome = () => {
        const result = [];
        for (let i = 0; i < 10; ++i) {
            result.push({
                id: i,
                img:
                    "https://i.pinimg.com/564x/96/a1/11/96a111a649dd6d19fbde7bcbbb692216.jpg",
                name: "문규빈",
                content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
                memberNum: Math.ceil(Math.random() * 10),
            });
        }

        setHome(result);
    };

    const getData = async () => {
        await Promise.all([getHome()]);
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
            <Wrapper>
                <MainLogo>
                    {/*<Image style={styles.logo} source={logo}/>*/}
                    <Text style={{
                        color:'black',
                        fontSize: 40,
                        fontWeight: "bold",
                    }}>OnYou</Text>
                </MainLogo>
                <FlatList
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    data={Home}
                    renderItem={()=>(
                        <MainArea>
                            <HeaderStyle>
                                <HeaderText>
                                    <LogoImage source={{uri: 'https://i.pinimg.com/564x/79/3b/74/793b74d8d9852e6ac2adeca960debe5d.jpg'}}/>
                                    <UserId onPress={goToProfile}><Text>Gyubin</Text></UserId>
                                    <View>
                                        {/*<Button title="Show modal" onPress={toggleModal} />*/}
                                        <TouchableOpacity onPress={toggleModal}>
                                            <Icon name="ellipsis-horizontal" size={30} style={{
                                                marginLeft: 230,
                                                color: 'black',
                                                top: 5
                                            }}/>
                                        </TouchableOpacity>
                                        <Modal isVisible={isModalVisible} backdropOpacity={0}
                                               deviceWidth={3000} swipeDirection={['up', 'left', 'right', 'down']}
                                               onBackdropPress={()=>toggleModal()}
                                               style={{backgroundColor: 'white', opacity: 0.8, }}
                                               onSwipeComplete={closeModal}
                                        >
                                            <View>
                                                <Button title="수정" onPress={goToModifiy} />
                                                <Button title="삭제" onPress={deleteCheck} />
                                                <Button title="신고" onPress={goToAccusation} />
                                            </View>
                                        </Modal>
                                    </View>
                                </HeaderText>
                                <>
                                    <Swiper
                                        horizontal
                                        showsButtons
                                        showsPagination
                                        loop={false}
                                        containerStyle={{
                                            width: "100%",
                                        }}
                                    >
                                        {mainImg.map((bundle, index) => {
                                            return (
                                                <ImgView key={index}>
                                                    {bundle.map((item, index) => {
                                                        return (
                                                            <ImgItem key={index}>
                                                                <ImgSource
                                                                    source={{
                                                                        uri: 'https://i.pinimg.com/564x/96/c8/3f/96c83fbf9b5987f24b96d529e9990b19.jpg',
                                                                    }}
                                                                />
                                                                {/*<ImageModal
                                                                    resizeMode="contain"
                                                                    imageBackgroundColor="#000000"
                                                                    style={{
                                                                        width: 250,
                                                                        height: 250,
                                                                    }}
                                                                    source={{
                                                                        uri: 'https://i.pinimg.com/564x/96/c8/3f/96c83fbf9b5987f24b96d529e9990b19.jpg',
                                                                    }}
                                                                />*/}
                                                            </ImgItem>
                                                        );
                                                    })}
                                                </ImgView>
                                            );
                                        })}
                                    </Swiper>
                                </>
                            </HeaderStyle>
                            <TextArea>
                            </TextArea>
                            <TextArea>
                                <LikeImg source={{uri: 'https://i.pinimg.com/564x/96/a1/11/96a111a649dd6d19fbde7bcbbb692216.jpg'}}/>
                                <LikeImg source={{uri: 'https://i.pinimg.com/564x/23/58/ec/2358ec9140ebe494df99beedf70c6c33.jpg'}}/>
                                <LikeImg source={{uri: 'https://i.pinimg.com/564x/96/c8/3f/96c83fbf9b5987f24b96d529e9990b19.jpg'}}/>
                                <LikeMent>
                                    <BoldText1 onPress={goToProfile}><Text>Gyubin</Text></BoldText1>님 외 <BoldText2>{rand(1,10000)}</BoldText2>명이 좋아합니다
                                </LikeMent>
                            </TextArea>
                            <ContentMent>
                                <MentId onPress={goToProfile}><Text>Gyubin</Text></MentId>
                                <Ment>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. </Ment>
                            </ContentMent>
                        </MainArea>
                    )}
                />
                <FloatingButton onPress={goToContent}>
                    <Ionicons name="ios-add-sharp" size={28} color="black"
                              style={{left: 1}}
                    />
                </FloatingButton>
            </Wrapper>
        </Container>

    )
}
export default Home;
