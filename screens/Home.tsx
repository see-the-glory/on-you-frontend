import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { FlatList, View, Text, TouchableOpacity, Dimensions, Modal, Alert, Pressable, Share, Platform } from "react-native";
import styled from "styled-components/native";
import Icon from "react-native-vector-icons/Ionicons";
import { Ionicons } from "@expo/vector-icons";

interface ValueInfo {
  str: string;
  isHT: boolean;
  idxArr: number[];
}
const Container = styled.SafeAreaView`
  position: relative;
  flex-direction: column;
  height: 100%;
`;

const MainLogo = styled.View`
  flex-direction: row;
  display: flex;
  height: 50px;
  left: 30px;
  background-color: white;
`;

const LogoImage = styled.Image`
  width: 26.8px;
  height: 26.3px;
  flex-grow: 0;
  margin: 3.1px 0 0;
  padding: 6.3px 7.2px 5.3px 7px;
  transform: rotate(-359.63deg);
  background-color: #295af5;
  top: 3%;
`;
const LogoText = styled.Text`
  margin: 10px 0 0 5px;
  font-size: 26px;
  font-weight: bold;
  font-style: normal;
  text-align: center;
  color: #020202;
`;
const AlamrIcon = styled.View`
  width: 19px;
  height: 19px;
  margin: 15px 15px 8px 10px;
  left: 340%;
`;
const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const MainArea = styled.View`
  justify-content: space-between;
  margin-bottom: 5%;
`;
const PlusFeed = styled.Button`
  color: white;
  margin-left: 200px;
`;

const HeaderStyle = styled.View`
  background-color: white;
  height: 400px;
  top: 10px;
`;
const HeaderText = styled.View`
  flex-direction: row;
`;

const MainText = styled.View`
  flex-direction: row;
  height: 60px;
  margin: 0 20px 0 20px;
`;

const UserImage = styled.Image`
  width: 42.5px;
  height: 42.5px;
  border-radius: 100px;
  flex-grow: 0;
  background-color: #c4c4c4;
`;

const UserId = styled.Text`
  color: black;
  font-weight: bold;
  font-size: 14px;
  margin-left: 10px;
`;
const CtrgArea = styled.View`
  width: 57px;
  height: 15px;
  flex-grow: 0;
  margin: 0.1px 153px 13.9px 8px;
  padding: 0.9px 0 1.1px;
  border-radius: 3px;
  background-color: #c4c4c4;
`;
const CtgrText = styled.TouchableOpacity`
  margin: 3px 5px 3px 5px;
`;

const ProjectNm = styled.Text`
  width: 48px;
  height: 13px;
  top: -2px;
  flex-grow: 0;
  font-size: 9px;
  font-weight: 500;
  font-style: normal;
  letter-spacing: -0.41px;
  text-align: center;
  color: #fff;
`;

//ModalStyle

const PeedId = styled.Text`
  color: black;
  font-size: 15px;
  left: 7px;
`;

const ImagePrint = styled.Image`
  width: 100%;
  height: 300px;
  justify-content: center;
  align-items: center;
`;

const TextArea = styled.View`
  background-color: white;
  flex-direction: row;
  width: 100%;
  margin-left: 10px;
`;

const LikeMent = styled.Text`
  flex-direction: row;
  color: black;
  margin-left: 10px;
  width: 100%;
  margin-top: 5px;
  justify-content: space-around;
`;

const LikeArea = styled.View`
  flex-direction: row;
  left: 5px;
`;
const ReplyArea = styled.View`
  flex-direction: row;
`;
const DataArea = styled.View``;
const DataText = styled.Text`
  color: #9a9a9a;
  font-size: 10px;
  left: 200px;
  top: -5px;
`;
const BoldText1 = styled.TouchableOpacity`
  font-weight: bold;
`;
const BoldText2 = styled.Text`
  font-weight: normal;
  top: 3%;
  font-size: 13px;
`;
const ContentMent = styled.View`
  background-color: white;
  flex-direction: row;
  left: 10px;
  top: 2%;
`;
const MentId = styled.Text`
  color: black;
  font-weight: bold;
  font-size: 15px;
`;

const Ment = styled.Text`
  color: black;
  margin: 0 10px 0 10px;
  width: 80%;
  font-size: 12px;
  left: 9px;
`;

const HashTag = styled.Text`
  color: rgb(99, 171, 255);
`;

const Wrapper = styled.View`
  flex: 1;
  background-color: white;
`;

const OptionArea = styled.View`
  flex-direction: row;
  position: relative;
`;
//ModalStyle

const ModalArea = styled.View`
  width: 18px;
  height: 18px;
  margin: 2px 0 9px 21px;
`;

const ModalIcon = styled.TouchableOpacity`
  top: 20px;
  left: 30px;
  height: 30px;
`;
const CenteredView = styled.View`
  flex: 1;
  justify-content: flex-end;
  align-items: center;
`;

const ModalView = styled.View`
  background-color: white;
  border-radius: 20px;
  padding: 35px;
  align-items: center;
  opacity: 0.9;
  width: 100%;
  height: 40%;
`;

const ModalText = styled.Text`
  font-weight: bold;
  text-align: center;
  font-size: 20px;
  margin: 15px;
  width: 120%;
  color: black;
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

const ModalBtn = styled.View`
  font-size: 15px;
`;

const FloatingButton = styled.TouchableOpacity`
  position: absolute;
  right: 25px;
  bottom: 94%;
  width: 30px;
  height: 30px;
  background-color: white;
  color: black;
  box-shadow: 1px 1px 3px gray;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  font-size: 10px;
`;

//Number
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const Home: React.FC<NativeStackScreenProps<any, "Home">> = ({ navigation: { navigate } }) => {
  const [text, onChangeText] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isPress, setIsPress] = React.useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [Home, setHome] = useState([{}]);
  const [mainImg, setmainImg] = useState([[{}]]);
  const [isModalVisible, setModalVisible] = useState(false);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
  const chartHeight = Dimensions.get("window").height;
  const chartWidth = Dimensions.get("window").width;

  const [isSelect, setSelect] = useState([false, false, false]);
  const [activeSection, setActiveSection] = useState([]);
  const [number, setNumber] = useState(rand(1, 100));

  //현재시간
  let today = new Date(); // today 객체에 Date()의 결과를 넣어줬다
  let time = {
    year: today.getFullYear(), //현재 년도
    month: today.getMonth() + 1, // 현재 월
    date: today.getDate(), // 현제 날짜
    hours: today.getHours(), //현재 시간
    minutes: today.getMinutes(), //현재 분
  };
  let timestring = `${time.year}년 ${time.month}월 ${time.date}일`;

  //heart선택
  const [heartSelected, setHeartSelected] = useState<boolean>(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const goToProfile = () => {
    navigate("HomeStack", {
      screen: "Profile",
    });
  };

  const goToContent = () => {
    navigate("HomeStack", {
      screen: "ImageSelecter",
    });
  };

  const goToReply = () => {
    navigate("HomeStack", {
      screen: "ReplyPage",
    });
  };

  const goToModifiy = () => {
    navigate("HomeStack", {
      screen: "ModifiyPeed",
    });
    setModalVisible(!isModalVisible);
  };

  const goToAlarm = () => {
    navigate("HomeStack", {
      screen: "AlarmPage",
    });
  };

  const goToAccusation = () => {
    navigate("HomeStack", {
      screen: "Accusation",
    });
    setModalVisible(!isModalVisible);
  };

  const closeModal = () => {
    setModalVisible(!isModalVisible);
  };

  const deleteCheck = () => {
    Alert.alert(
      "게시글을 삭제하시겠어요?",
      "30일 이내에 내 활동의 최근 삭제 항목에서 이 게시물을 복원할 수 있습니다." + "30일이 지나면 영구 삭제 됩니다. ",
      [
        {
          text: "아니요",
          onPress: () => console.log(""),
          style: "cancel",
        },
        { text: "네", onPress: () => Alert.alert("삭제되었습니다.") },
      ],
      { cancelable: false }
    );
    setModalVisible(!isModalVisible);
  };

  const getHome = () => {
    const result = [];
    for (let i = 0; i < 2; ++i) {
      result.push({
        id: i,
        img: "https://i.pinimg.com/564x/96/a1/11/96a111a649dd6d19fbde7bcbbb692216.jpg",
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
  };

  const onDecrease = () => {
    setNumber(number - 1);
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: "현재 이 글의 링크가 복사됨.",
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("activityType!");
        } else {
          console.log("Share!");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("dismissed");
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const link =
    Platform.OS === "ios"
      ? "https://apps.apple.com/us/app/%EB%B3%B4%EB%8B%A5-%EB%82%B4-%EB%B3%B4%ED%97%98%EC%A0%90%EC%88%98-%EC%A7%84%EB%8B%A8-%EC%83%88%EB%8A%94-%EB%B3%B4%ED%97%98%EB%A3%8C-%ED%99%95%EC%9D%B8/id1447862053"
      : "https://play.google.com/store/apps/details?id=com.mrp.doctor&hl=ko";

  const goReply = (id: number) => {
    return (
      <Pressable
        onPress={() => {
          setSelect([...isSelect.slice(0, id), !isSelect[id], ...isSelect.slice(id + 1)]);
        }}
      >
        <Icon name="md-chatbox-ellipses" size={25} color="black" onPress={goToReply} style={{ left: 10, top: 5 }} />
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
          <LogoImage
            source={{
              uri: "https://i.pinimg.com/564x/cd/c9/a5/cdc9a5ffec176461e7a1503d3b2553d4.jpg",
            }}
          />
          <LogoText>OnYou</LogoText>
          <AlamrIcon>
            <Icon name="md-notifications-outline" onPress={goToAlarm} size={19} color="black" />
          </AlamrIcon>
        </MainLogo>
        <FlatList
          refreshing={refreshing}
          onRefresh={onRefresh}
          keyExtractor={(item, index) => index + ""}
          data={Home}
          renderItem={() => (
            <MainArea>
              <HeaderStyle>
                <HeaderText>
                  <MainText>
                    <UserImage
                      source={{
                        uri: "https://i.pinimg.com/564x/9e/d8/4c/9ed84cf3fc04d0011ec4f75c0692c83e.jpg",
                      }}
                    />
                    <View>
                      <UserId>이진규</UserId>
                      <CtrgArea>
                        <CtgrText onPress={goToReply}>
                          <ProjectNm>온유프로젝트</ProjectNm>
                        </CtgrText>
                      </CtrgArea>
                    </View>
                  </MainText>
                  <ModalArea>
                    <ModalIcon onPress={toggleModal}>
                      <Icon
                        name="ellipsis-vertical"
                        size={20}
                        style={{
                          color: "black",
                        }}
                      />
                      {/*<View onPress={toggleModal}>
                                            </View>*/}
                    </ModalIcon>
                    <View>
                      <Modal animationType="slide" transparent={true} visible={isModalVisible}>
                        <CenteredView onTouchEnd={closeModal}>
                          <ModalView>
                            <ModalText onPress={goToModifiy}>수정</ModalText>
                            <ModalText style={{ color: "red" }} onPress={deleteCheck}>
                              삭제
                            </ModalText>
                            <ModalText onPress={goToAccusation}>신고</ModalText>
                            <ModalText onPress={closeModal}>Close</ModalText>
                          </ModalView>
                        </CenteredView>
                      </Modal>
                    </View>
                  </ModalArea>
                </HeaderText>
              </HeaderStyle>
              <TextArea>
                <LikeMent>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <LikeArea>
                      <TouchableOpacity onPress={() => setHeartSelected(!heartSelected)}>
                        {heartSelected ? <Ionicons name="md-heart" size={20} color="red" /> : <Ionicons name="md-heart-outline" size={20} color="black" />}
                      </TouchableOpacity>
                      <BoldText2>{number}</BoldText2>
                    </LikeArea>
                    <ReplyArea>
                      <TouchableOpacity onPress={goToReply}>
                        <Icon name="md-chatbox-ellipses-outline" size={20} color="black" style={{ left: 10 }} />
                      </TouchableOpacity>
                      <Text style={{ left: 10, fontWeight: "normal", fontSize: 13 }}>{rand(1, 100)}</Text>
                    </ReplyArea>
                  </View>
                  <DataArea>
                    <DataText>{timestring}</DataText>
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
                {/*<MentId>유주은</MentId>*/}
                <Ment>
                  디자인 이쁘다.
                  <HashTag onPress={mentionHashtagClick}>#잘 뽑혔구먼 </HashTag>
                  디자인 이쁘다.
                  <HashTag onPress={mentionHashtagClick}>#배고프다.</HashTag>
                  디자인 이쁘다.
                  <HashTag onPress={mentionHashtagClick}>#배고프다.</HashTag>
                  디자인 이쁘다.
                </Ment>
              </ContentMent>
            </MainArea>
          )}
        ></FlatList>
        <FloatingButton onPress={goToContent}>
          <Icon name="md-image-outline" size={19} color="black" />
        </FloatingButton>
      </Wrapper>
    </Container>
  );
};
export default Home;
