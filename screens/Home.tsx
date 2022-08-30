import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity, Dimensions, Modal, Alert, Slider, useWindowDimensions, Platform, View, Text } from "react-native";
import styled from "styled-components/native";
import Swiper from "react-native-swiper";
import { SliderBox } from "react-native-image-slider-box";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useQuery, useInfiniteQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { Feed, FeedsResponse, FeedsParams, getFeeds, FeedApi, Reply } from "../api";
import { gql } from "apollo-boost";
import CustomText from "../components/CustomText";
import { useMutation } from "react-apollo-hooks";
import * as url from "url";

const Container = styled.SafeAreaView`
  flex: 1;
`;

const HeaderView = styled.View<{ size: number }>`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px ${(props) => props.size}px 10px ${(props) => props.size}px;
  margin-bottom: 20px;
`;

const SubView = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const LogoImage = styled.Image`
  width: 28px;
  height: 28px;
  margin-right: 15px;
  border-radius: 14px;
`;
const LogoText = styled(CustomText)`
  font-size: 26px;
  font-weight: bold;
  color: #020202;
  line-height: 30px;
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
  background-color: #c4c4c4;
`;

const UserId = styled.Text`
  color: black;
  font-weight: bold;
  font-size: 14px;
  padding-bottom: 5px;
`;
const ClubBox = styled.TouchableOpacity`
  padding: 3px 6px 3px 6px;
  background-color: #c4c4c4;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;

const ClubName = styled.Text`
  font-size: 10px;
  font-weight: 500;
  color: white;
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
  top: 10%;
  font-size: 9px;
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

const HashTag = styled.Text`
  color: rgb(99, 171, 255);
`;

const OptionArea = styled.View`
  flex-direction: row;
  position: relative;
`;
//ModalStyle
const ModalArea = styled.View``;

const ModalIcon = styled.TouchableOpacity``;
const CenteredView = styled.View`
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  background-color: gray;
  opacity: 0.8;
`;

const ModalView = styled.View`
  background-color: white;
  padding: 35px;
  align-items: center;
  opacity: 1;
  width: 100%;
  height: 30%;
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

const ImgItem = styled.View``;

const ModalBtn = styled.View`
  font-size: 15px;
`;

const FloatingButton = styled.TouchableOpacity`
  position: absolute;
  right: 25px;
  top: 1.7%;
  width: 30px;
  height: 30px;
  background-color: red;
  color: black;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  font-size: 10px;
`;

const FeedContainer = styled.View`
  flex: 1;
  width: 100%;
  margin-bottom: 30px;
  padding: 0 20px 0 20px;
`;

const FeedHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 10px;
`;

const FeedUser = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const UserInfo = styled.View`
  padding-left: 10px;
`;
const FeedMain = styled.View``;
const FeedImage = styled.View``;
const FeedInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 5px 10px 5px;
`;
const LeftInfo = styled.View`
  flex-direction: row;
`;
const InfoArea = styled.View`
  flex-direction: row;
  align-items: center;
  padding-right: 10px;
`;

const NumberText = styled.Text`
  font-size: 12px;
  font-weight: 300;
  padding-left: 5px;
`;
const RightInfo = styled.View``;
const Timestamp = styled.Text`
  color: #9a9a9a;
  font-size: 12px;
`;

const Content = styled.View`
  padding: 0 12px 0 12px;
`;

const Ment = styled.Text`
  width: 100%;
  color: black;
  font-size: 12px;
`;
//Number
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const Home: React.FC<NativeStackScreenProps<any, "Home">> = ({ navigation: { navigate } }) => {
  const [Home, setHome] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [number, setNumber] = useState(rand(1, 100));
  const [isPageTransition, setIsPageTransition] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const SCREEN_PADDING_SIZE = 20;
  const FEED_IMAGE_SIZE = SCREEN_WIDTH - SCREEN_PADDING_SIZE * 2;
  const token = useSelector((state) => state.AuthReducers.authToken);

  const [isLiked, setIsLiked]=useState();
  const [likeCount, setLikeCount]=useState();
  /**현재시간*/
  let today = new Date("2022-08-03T13:26:43.005981");
  let time = {
    year: today.getFullYear(), //현재 년도
    month: today.getMonth() + 1, // 현재 월
    date: today.getDate(), // 현제 날짜
    hours: today.getHours(), //현재 시간
    minutes: today.getMinutes(), //현재 분
  };
  let timestring = `${time.year}년 ${time.month}월 ${time.date}일`;

  const [params, setParams] = useState<FeedsParams>({
    token,
  });

  // const fetchBlacklist = async ({ pageParam = 1 }) => {
  //   const response = await axiosInstance.get(`http://3.39.190.23:8080/api/feeds/${pageParam}`);
  //   const result = response.data;
  //   // axios로 받아온 데이터를 다음과 같이 변경!

  //   return {
  //     result: result.blacklist,
  //     nextPage: pageParam + 1,
  //     isLast: result.is_last,
  //   };
  // };
  // const {
  //   isLoading: feedsLoading,
  //   data: feeds,
  //   isRefetching: isRefetchingClubs,
  //   hasNextPage,
  //   fetchNextPage,
  // } = useInfiniteQuery<FeedsResponse>(["getFeeds", fetchBlacklist], FeedApi.getFeeds, {
  //   //useQuery(["getFeeds", token], FeedApi.getFeeds, {
  //   getNextPageParam: (lastPage, pages) => {
  //     if (!lastPage.isLast) return lastPage.nextPage;
  //     return undefined;
  //   },
  //   onSuccess: (res) => {
  //     setIsPageTransition(false);
  //     console.log(res);
  //   },
  //   onError: (err) => {
  //     console.log(err);
  //   },
  // });



  const getFeeds = () => {
    return fetch(`http://3.39.190.23:8080/api/feeds`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());
  };

  const {
    isLoading: feedsLoading,
    data: feeds,
    isRefetching: isRefetchingClubs,
  } = useQuery<FeedsResponse>(["getFeeds", token], getFeeds, {
    //useQuery(["getFeeds", token], FeedApi.getFeeds, {
    onSuccess: (res) => {
      console.log(res+'realasdgsdagsdf@@@@@@@@@@@@@@@@@@@@@');
    },
    onError: (err) => {
      console.log(err);
    },
  });

  useEffect(()=>{
    getFeeds();
  },[])

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

  const goToReply = (replyData: Reply) => {
    navigate("HomeStack", {
      screen: "ReplyPage",
      replyData,
    });
  };

  const goToModifiy = () => {
    navigate("HomeStack", {
      screen: "ModifiyPeed",
    });
    setModalVisible(!isModalVisible);
  };

  const goToClub = () => {
    navigate("HomeStack", {
      screen: "MyClubSelector",
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

/*  const getHome = () => {
    const result = [];
    for (let i = 0; i < 1; ++i) {
      result.push({
        id: i,
        img: "https://i.pinimg.com/564x/96/a1/11/96a111a649dd6d19fbde7bcbbb692216.jpg",
        name: "문규빈",
        content: "",
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
  }, []);*/

  const onRefresh = async () => {
    setRefreshing(true);
     await queryClient.refetchQueries(["feeds"]);
    setRefreshing(false);
  };

  // const loadMore = () => {
  //   if (hasNextPage) fetchNextPage();
  // };



  return feedsLoading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <Container>
      <HeaderView size={SCREEN_PADDING_SIZE}>
        <SubView>
          <LogoImage source={{ uri: "https://i.pinimg.com/564x/cd/c9/a5/cdc9a5ffec176461e7a1503d3b2553d4.jpg" }} />
          <LogoText>OnYou</LogoText>
        </SubView>
        <SubView>
          {/* <Ionicons name="md-notifications-outline" onPress={goToAlarm} size={19} color="black" /> */}
          <MaterialIcons name="add-photo-alternate" onPress={goToClub} style={{ paddingLeft: "2.5%" }} size={19} color="black" />
        </SubView>
      </HeaderView>

      <FlatList
         refreshing={refreshing}
         onRefresh={onRefresh}
        // onEndReached={loadMore}
        // numColumns={2}
        keyExtractor={(item: Feed, index: number) => String(index)}
        //data={feeds?.pages.map((page) => page?.responses?.content).flat()}
        data={feeds?.data}
        renderItem={({ item }: { item: Feed }) => (
          <FeedContainer>
            <FeedHeader>
              <FeedUser>
                <UserImage source={{ uri: "https://i.pinimg.com/564x/9e/d8/4c/9ed84cf3fc04d0011ec4f75c0692c83e.jpg" }} />
                {/** 버그 발생*/}
                <UserInfo>
                  <UserId>{item.userName}</UserId>
                  <ClubBox>
                    <ClubName>{item.clubName}</ClubName>
                  </ClubBox>
                </UserInfo>
              </FeedUser>
              <ModalArea>
                <ModalIcon onPress={toggleModal}>
                  <Ionicons name="ellipsis-vertical" size={20} color={"black"} />
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
            </FeedHeader>
            <FeedMain>
              {/** 버그 발생*/}
              <FeedImage>
                <Swiper horizontal dotColor="#E0E0E0" activeDotColor="#FF714B" containerStyle={{ backgroundColor: "black", height: FEED_IMAGE_SIZE }}>
                  <SliderBox images={item.imageUrls} sliderBoxHeight={FEED_IMAGE_SIZE} />
                </Swiper>
              </FeedImage>
              <FeedInfo>
                <LeftInfo>
                  <InfoArea>
                    <TouchableOpacity onPress={() => setHeartSelected(!heartSelected)}>
                      {heartSelected ? <Ionicons name="md-heart" size={20} color="red"/> : <Ionicons name="md-heart-outline" size={20} color="black"/>}
                    </TouchableOpacity>
                    {heartSelected? <NumberText>{item.likesCount +1} </NumberText> : <NumberText> {item.likesCount} </NumberText>}
                  </InfoArea>
                  <InfoArea>
                    <TouchableOpacity onPress={goToReply}>
                      <Ionicons name="md-chatbox-ellipses-outline" size={20} color="black" />
                    </TouchableOpacity>
                    <NumberText>{item.commentCount}</NumberText>
                  </InfoArea>
                </LeftInfo>
                <RightInfo>
                  <Timestamp>{timestring}</Timestamp>
                </RightInfo>
              </FeedInfo>
             {/* <Content>
                <Ment>{item.content}</Ment>
              </Content>*/}
            </FeedMain>
          </FeedContainer>
        )}
      ></FlatList>
    </Container>
  );
};
export default Home;