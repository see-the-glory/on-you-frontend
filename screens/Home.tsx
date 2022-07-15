import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, {useEffect, useRef, useState} from 'react';
import {
    ActivityIndicator,
    FlatList,
    View,
    Text,
    TouchableOpacity,
    Button,
    Dimensions,
    Modal,
    TouchableWithoutFeedback,
    Alert,
    Slider,
    Image,
    ScrollView,
    useWindowDimensions,
    Pressable,
    Share,
    Platform,
    StyleSheet,
    Animated, Easing, ImageBackground
} from 'react-native';
import styled from "styled-components/native";
import Swiper from "react-native-swiper";
import { SliderBox } from "react-native-image-slider-box";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
import {Ionicons} from "@expo/vector-icons";
import  MentionHashtagTextView  from  "react-native-mention-hashtag-text";

interface ValueInfo{
    str: string;
    isHT: boolean;
    idxArr: number[];
}
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

const Notification=styled.View`
  right: 90px;
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
    const [data,setData]=useState([]);

    const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
    const chartHeight = Dimensions.get('window').height;
    const chartWidth = Dimensions.get('window').width;

    const [isSelect, setSelect] = useState([false, false, false]);
    const [activeSection, setActiveSection] = useState([]);
    const [number, setNumber] = useState(rand(1,100));

    //현재시간
    let today = new Date(); // today 객체에 Date()의 결과를 넣어줬다
    let time = {
        year: today.getFullYear(),  //현재 년도
        month: today.getMonth() + 1, // 현재 월
        date: today.getDate(), // 현제 날짜
        hours: today.getHours(), //현재 시간
        minutes: today.getMinutes(), //현재 분
    };
    let timestring = `${time.year}/${time.month}/${time.date} ${time.hours}:${time.minutes}`;


    const getApi=async ()=>{
        try{
            setLoading(true);
            const response= await axios.get(
                `http://3.39.190.23:8080/api/clubs`
            )
            setData(response.data.data)
            console.log(data)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        getApi();
    },[]);

    //heart선택
    const [heartSelected, setHeartSelected] = useState<boolean>(false);

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

    const goToReply = () => {
        navigate("HomeStack",{
            screen:"ReplyPage"
        })
    }

    const goToModifiy=()=>{
        navigate("HomeStack",{
            screen:"ModifiyPeed"
        })
        setModalVisible(!isModalVisible);
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
        for (let i = 0; i < 5; ++i) {
            result.push({
                id: i,
                img:
                    "https://i.pinimg.com/564x/96/a1/11/96a111a649dd6d19fbde7bcbbb692216.jpg",
                name: "문규빈",
                content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
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


    const onIncrease = () => {
        setNumber(number + 1);
    }

    const onDecrease = () => {
        setNumber(number - 1);
    }

    const onShare = async () => {
        try {
            const result = await Share.share(
                {
                    message: '현재 이 글의 링크가 복사됨.',
                }
            );

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('activityType!');
                } else {
                    console.log('Share!');
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('dismissed');
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    const link =
        Platform.OS === 'ios'
            ? 'https://apps.apple.com/us/app/%EB%B3%B4%EB%8B%A5-%EB%82%B4-%EB%B3%B4%ED%97%98%EC%A0%90%EC%88%98-%EC%A7%84%EB%8B%A8-%EC%83%88%EB%8A%94-%EB%B3%B4%ED%97%98%EB%A3%8C-%ED%99%95%EC%9D%B8/id1447862053'
            : 'https://play.google.com/store/apps/details?id=com.mrp.doctor&hl=ko';

    const goReply = (id: number) => {
        return (
            <Pressable
                onPress={() => {
                    setSelect([
                        ...isSelect.slice(0, id),
                        !isSelect[id],
                        ...isSelect.slice(id + 1),
                    ]);
                }}>
                <Icon name="md-chatbox-ellipses" size={25} color='black'
                      onPress={goToReply}
                      style={{left: 10, top: 5}}
                />
                <BoldText2>{number}</BoldText2>
            </Pressable>
        );
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
                <MainLogo>
                    {/*<Image style={styles.logo} source={logo}/>*/}
                    <Text style={{
                        color:'black',
                        fontSize: 35,
                        fontWeight: "bold",
                    }}>OnYou</Text>
                    <View>
                        <Icon name="md-notifications" size={28} color="black" style={{left: 190, top:5}} />
                    </View>
                </MainLogo>
                <FlatList refreshing={refreshing} onRefresh={onRefresh} keyExtractor={(item, index) => index + ""} data={Home} renderItem={()=>(
                    <MainArea>
                        <HeaderStyle>
                            <HeaderText>
                                <MainText>
                                    <UserImage source={{uri: 'https://i.pinimg.com/564x/9e/d8/4c/9ed84cf3fc04d0011ec4f75c0692c83e.jpg'}}/>
                                    <View>
                                        <UserId>이진규
                                            {/*<FlatList
                                            refreshing={refreshing}
                                            onRefresh={onRefresh}
                                            data={data}
                                            keyExtractor={(item, index) => index + ""}
                                            renderItem={({ item }) => (
                                                <>
                                                    <PeedId><Text>{item.userName}</Text></PeedId>
                                                </>
                                            )}
                                        />*/}
                                        </UserId>
                                        <CtrgArea>
                                            <CtgrText onPress={goToReply}>
                                                <Text>
                                                    온유프로젝트
                                                </Text></CtgrText>
                                        </CtrgArea>
                                    </View>
                                </MainText>
                                <ModalArea>
                                    <TouchableOpacity onPress={toggleModal} style={{top: 10, left: 220 }}>
                                        <Icon name="ellipsis-vertical" size={30} style={{
                                            color: 'black',
                                        }}/>
                                        {/*<View onPress={toggleModal}>
                                            </View>*/}
                                    </TouchableOpacity>
                                    <View>
                                        <Modal
                                            animationType="slide"
                                            transparent={true}
                                            visible={isModalVisible}
                                        >
                                            <CenteredView onTouchEnd={closeModal}>
                                                <ModalView>
                                                    <ModalText onPress={goToModifiy}>수정</ModalText>
                                                    <ModalText onPress={deleteCheck}>삭제</ModalText>
                                                    <ModalText onPress={goToAccusation}>신고</ModalText>
                                                    <ModalText onPress={closeModal}>Close</ModalText>
                                                </ModalView>
                                            </CenteredView>
                                        </Modal>
                                    </View>
                                </ModalArea>
                            </HeaderText>
                            <>
                                <Swiper
                                    horizontal
                                    containerStyle={{
                                        width: "100%",
                                        top: -5,

                                    }}
                                >
                                    {mainImg.map((bundle, index) => {
                                        return (
                                            <ImgView key={index}>
                                                {bundle.map((item, index) => {
                                                    return (
                                                        <ImgItem key={index}>
                                                            <SliderBox  images={[
                                                                "https://i.pinimg.com/736x/69/01/fa/6901fa625a250d1a0bf42dd97b941d86.jpg",
                                                                "https://i.pinimg.com/564x/e8/7f/50/e87f50bb77134487ce107966f7fc26a9.jpg",
                                                                "https://i.pinimg.com/564x/23/58/ec/2358ec9140ebe494df99beedf70c6c33.jpg",
                                                                "https://i.pinimg.com/564x/0f/6a/13/0f6a13baac82b80f5b1a1d4d9e20e479.jpg",
                                                                "https://i.pinimg.com/originals/69/96/53/69965364cb740c83facb682de198f303.gif"
                                                            ]}
                                                                        sliderBoxHeight={350}
                                                                        sliderBoxWidth={390}
                                                            />
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
                            <LikeMent>
                                <LikeArea>
                                    <TouchableOpacity onPress={() => setHeartSelected(!heartSelected)}>
                                        {heartSelected ? (
                                            <Ionicons name="md-heart" size={24} color="red" />
                                        ) : (
                                            <Ionicons name="md-heart-outline" size={24} color="red" />
                                        )}
                                    </TouchableOpacity>
                                    <BoldText2>{number}</BoldText2>
                                </LikeArea>
                                <ReplyArea>
                                    <TouchableOpacity onPress={goToReply}>
                                        <Icon name="md-chatbox-ellipses-outline" size={25} color='black'
                                              style={{ top: 2, left:5}}
                                        />
                                    </TouchableOpacity>
                                    <Text style={{left: 5, fontWeight: 'normal', top: 5}}>{rand(1,100)}</Text>
                                </ReplyArea>
                                <TouchableOpacity onPress={()=>onShare()}>
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
                            {/*
                            <View style={{ flex: 1, padding: 10, width: 2000 }}>
                                {loading ? <ActivityIndicator/> : (
                                    <View>
                                        <FlatList
                                            refreshing={refreshing}
                                            onRefresh={onRefresh}
                                            data={data}
                                            keyExtractor={(item, index) => index + ""}
                                            renderItem={({ item }) => (
                                                <View style={{flexDirection: 'row'}}>
                                                    <MentionHashtagTextView
                                                        mentionHashtagPress={mentionHashtagClick}
                                                        mentionHashtagColor={"#63ABFF"}
                                                    >
                                                        {item.content}
                                                    </MentionHashtagTextView>
                                                    <Ment text={text} numberOfLines={3} ellipsizeMode={"tail"}>{item.content}</Ment>
                                                </View>
                                            )}
                                        />
                                    </View>
                                )}
                            </View>*/}
                            <MentId>유주은</MentId>
                            <Ment> 디자인 이쁘다</Ment>
                            <HashTag>#잘 뽑혔구먼</HashTag>
                        </ContentMent>
                    </MainArea>
                )}></FlatList>
                <FloatingButton onPress={goToContent}>
                    <Ionicons name="ios-add-sharp" size={28} color="black"/>
                </FloatingButton>
            </Wrapper>
        </Container>
    )
}
export default Home;