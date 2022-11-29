import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ActivityIndicator,
  Platform,
  StatusBar,
  ScrollView,
  VirtualizedList,
  RefreshControl,
  Animated
} from "react-native";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient
} from "react-query";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import {
  Feed,
  FeedApi,
  FeedsParams,
  FeedsResponse,
  UserApi,
  UserInfoResponse,
  likeCount,
  likeCountReverse,
  FeedsLikeReponse,
  ClubApi,
  ClubCreationRequest,
  FeedLikeRequest,
  FeedReverseLikeRequest,
  Club, ClubsParams
} from "../api";
import CustomText from "../components/CustomText";
import {
  FeedData,
  HomeScreenProps,
} from "../types/Feed";
import { Modalize, useModalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { ImageSlider } from "react-native-image-slider-banner";

const Loader = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-top: ${Platform.OS === "android" ? StatusBar.currentHeight : 0}px;
`;

const Container = styled.SafeAreaView`
  flex: 1;
  top: ${Platform.OS === 'android' ? 5 : 0}%;
  padding-bottom:  ${Platform.OS === 'android' ? 6 : 0}%;
`;

const HeaderView = styled.View<{ size: number }>`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${(props) => props.size}px 0 ${(props) => props.size}px;
  margin-bottom: 10px;
  position: sticky;
`;

const SubView = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const LogoImage = styled.Image`
  width: 28px;
  height: 28px;
  margin-right: 10px;
  border-radius: 14px;
`;
const LogoText = styled(CustomText)`
  font-size: 26px;
  font-weight: bold;
  color: #020202;
  line-height: 30px;
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
//ModalStyle
const ModalArea = styled.View`
  flex: 1;
`;

const ModalIcon = styled.TouchableOpacity``;
const CenteredView = styled.View`
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  background-color: gray;
  opacity: 0.8;
`;

const ModalContainer = styled.View`
  flex: 1;
`;

const ModalView = styled.View`
  background-color: white;
  align-items: center;
  opacity: 1;
  width: 100%;
  height: auto;
`;

const ModalText = styled.Text`
  font-weight: bold;
  text-align: center;
  font-size: 20px;
  padding: 30px;
  width: 100%;
  color: black;
  height: auto;
`;

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

//Img Slider

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
  margin-bottom: ${Platform.OS === 'ios' ? 20 : 30}px;
  padding: 0 20px 0 20px;
`;

const FeedHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  margin: 20px 0 10px 0;
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

const LikeClick=styled.TouchableOpacity`
`

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

const Ment = styled(CustomText)`
  width: 100%;
  color: black;
  font-size: 12px;
`;

const ImageSource = styled.Image<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
`;


interface HeartType {
  feedId: number;
  heart: boolean;
}

const Home:React.FC<HomeScreenProps> = ({
                                          navigation:{navigate},
                                        })=> {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const SCREEN_PADDING_SIZE = 20;
  const FEED_IMAGE_SIZE = SCREEN_WIDTH - SCREEN_PADDING_SIZE * 2;
  const token = useSelector((state:any) => state.AuthReducers.authToken);
  const [isPageTransition, setIsPageTransition] = useState<boolean>(false);

  //모달
  const modalizeRef = useRef<Modalize>(null);
  const onOpen = () => {
    modalizeRef.current?.open();
  };
  //heart선택
  const [heartMap, setHeartMap] = useState(new Map());

  //피드
  const {
    isLoading: feedsLoading,
    data: feeds,
    isRefetching: isRefetchingFeeds,
  } = useQuery<FeedsResponse>(["getFeeds", {token}], FeedApi.getFeeds, {
    //useQuery(["getFeeds", token], FeedApi.getFeeds, {
    onSuccess: (res) => {
      console.log('home call')
      setIsPageTransition(false);
      let heartDataMap = new Map();

      for (let i = 0; i < res?.data?.length; ++i) {
        heartDataMap.set(res?.data[i].id, false);
        //나중에 api 호출했을때는 false자리에 id 불러오듯이 값 받아와야함.
      }
      setHeartMap(heartDataMap);
    },
    onError: (err) => {
      console.log(err);
    },
  });
  //무한스크롤
  /*const {
    isLoading: feedsLoading,
    data: feeds,
    isRefetching: isRefetchingFeeds,
    hasNextPage,
    refetch: feedRefetch,
    fetchNextPage
  } = useInfiniteQuery<FeedsResponse>(["getFeeds", {token}], FeedApi.getFeeds, {
    getNextPageParam: (currentPage) => {
      if (currentPage) {
        return currentPage.hasNext === false ? null : currentPage.responses?.content[currentPage.responses?.content.length - 1].customCursor;
      }
    },
    onSuccess: (res) => {
      console.log('homeCall')
      console.log(res)
      setIsPageTransition(false);
      /!*let heartDataMap = new Map();

      for (let i = 0; i < res?.data?.length; ++i) {
        heartDataMap.set(res?.data[i].id, false);
      }
      setHeartMap(heartDataMap);*!/
    },
    onError: (err) => {
      console.log(err);
    },
  });*/
  //User
  const {
    isLoading: userInfoLoading, // true or false
    data: userInfo,
  } = useQuery<UserInfoResponse>(["getUserInfo", token], UserApi.getUserInfo);
  let myName = userInfo?.data?.name;
  let myId = userInfo?.data?.id;

//Like
  const LikeMutation = useMutation( FeedApi.likeCount, {
    onSuccess: (res) => {
      if (res.status === 200) {
        console.log(res)
      } else {
        console.log(`mutation success but please check status code`);
        console.log(res);
      }
    },
    onError: (error) => {
      console.log("--- Error ---");
      console.log(`error: ${error}`);
    },
    onSettled: (res, error) => {},
  });

  const LikeFeed=(feedData:Feed)=>{
    feedData.likeYn = true
    const data = {
      id: feedData.id,
    };

    const likeRequestData: FeedLikeRequest=
      {
        data,
        token,
      }
    LikeMutation.mutate(likeRequestData);
    console.log(data);
  };

  //ReverseLike
  const LikeReverseMutation = useMutation( FeedApi.likeCountReverse, {
    onSuccess: (res) => {
      if (res.status === 200) {
        console.log(res)
      } else {
        console.log(`mutation success but please check status code`);
        console.log(res);
      }
    },
    onError: (error) => {
      console.log("--- Error ---");
      console.log(`error: ${error}`);
      // return navigate("Home", {});
    },
    onSettled: (res, error) => {},
  });

  const LikeReverseFeed=(feedData:Feed)=>{
    feedData.likeYn = false
    const data = {
      id: feedData.id,
    };

    const likeRequestData: FeedLikeRequest=
      {
        data,
        token,
      }
    LikeReverseMutation.mutate(likeRequestData);
    console.log(data);
  };

  const goToReply = (feedData: Feed) => {
    navigate("HomeStack", {
      screen: "ReplyPage",
      feedData,
    });
  };

  const goToModifiy = (feedData:Feed) => {
    navigate("HomeStack", {
      screen: "ModifiyPeed",
      feedData,
    });
    modalizeRef.current?.close()
  };

  const goToClub = () => {
    return navigate("HomeStack", {
      screen: "MyClubSelector",
      userId: myId,
    });
  };

  const goToAccusation = (feedData:Feed) => {
    navigate("HomeStack", {
      screen: "Accusation",
      feedData,
    });
    modalizeRef.current?.close()
  };

  const deleteCheck = (feedData:Feed) => {
    Alert.alert(
      "게시글을 삭제하시겠어요?",
      "30일 이내에 내 활동의 최근 삭제 항목에서 이 게시물을 복원할 수 있습니다." + "30일이 지나면 영구 삭제 됩니다. ",
      [
        {
          text: "아니요",
          onPress: () => console.log("삭제 Api 호출"),
          style: "cancel",
        },
        { text: "네", onPress: () => Alert.alert("삭제되었습니다.") },
      ],
      { cancelable: false }
    );
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries(["getFeeds"]);
    setRefreshing(false);
  };

  //시간측정
  const timeLine =(date:any) =>{
    const start = new Date(date);
    const end = new Date(); // 현재 날짜

    let diff = (end - start); // 경과 시간

    const times = [
      {time: "분", milliSeconds: 1000 * 60},
      {time: "시간", milliSeconds: 1000 * 60 * 60},
      {time: "일", milliSeconds: 1000 * 60 * 60 * 24},
      {time: "개월", milliSeconds: 1000 * 60 * 60 * 24 * 30},
      {time: "년", milliSeconds: 1000 * 60 * 60 * 24 * 365},
    ].reverse();
    // 년 단위부터 알맞는 단위 찾기
    for (const value of times) {
      const betweenTime = Math.floor(diff / value.milliSeconds);
      // 큰 단위는 0보다 작은 소수 단위 나옴
      if (betweenTime > 0) {
        return `${betweenTime}${value.time} 전`;
      }
    }
    // 모든 단위가 맞지 않을 시
    return "방금 전";
  }

/*
  const loadMore = () => {
    if (hasNextPage) fetchNextPage();
  };
*/


  const loading = feedsLoading && userInfoLoading;

  return loading ?(
    <Loader>
      <ActivityIndicator/>
    </Loader>
  ):(
    <>
      <Container>
        <FeedContainer>
          <HeaderView size={SCREEN_PADDING_SIZE}>
            <SubView>
              <LogoImage source={{ uri: "https://i.pinimg.com/564x/cd/c9/a5/cdc9a5ffec176461e7a1503d3b2553d4.jpg" }} />
              <LogoText>OnYou</LogoText>
            </SubView>
            <SubView>
              <MaterialIcons name="add-photo-alternate" onPress={goToClub} style={{ left: 9 }} size={19} color="black" />
            </SubView>
          </HeaderView>
          <FlatList
            showsHorizontalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={onRefresh}
            // onEndReached={loadMore}
            data={feeds?.data}
            // data={feeds?.pages?.map((page) => page?.responses?.content).flat()}
            disableVirtualization={false}
            keyExtractor={(item: Feed, index: number) => String(index)}
            renderItem={({ item, index }: { item: Feed; index: number }) => (
              <>
                <FeedHeader>
                  <FeedUser>
                    <UserImage
                      source={{
                        uri: userInfo?.data.thumbnail === null ? "https://k.kakaocdn.net/dn/dpk9l1/btqmGhA2lKL/Oz0wDuJn1YV2DIn92f6DVK/img_110x110.jpg" : userInfo?.data.thumbnail,
                      }}
                    />
                    <UserInfo>
                      <UserId>{item.userName}</UserId>
                      <UserId>{item.likeYn.toString()}</UserId>
                      <ClubBox>
                        <ClubName>{item.clubName}</ClubName>
                      </ClubBox>
                    </UserInfo>
                  </FeedUser>
                  <View>
                    <ModalIcon
                      onPress={()=>onOpen()}>
                      <Ionicons name="ellipsis-vertical" size={20} color={"black"} />
                      <Text>{item.id}</Text>
                    </ModalIcon>
                  </View>
                  <Portal>
                    <Modalize
                      ref={modalizeRef}
                      modalHeight={250}
                      handlePosition="inside"
                      modalStyle={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
                    >
                      <ModalContainer >
                        {userInfo?.data.id===item.userId ?
                          <ModalView>
                            <ModalText onPress={() => goToModifiy(item)}>수정</ModalText>
                            <ModalText style={{ color: "red" }} onPress={()=>deleteCheck(item)}>
                              삭제
                            </ModalText>
                            <Text>{item.userName},{myName},{item.id}</Text>
                          </ModalView>
                          :
                          <ModalView>
                            <ModalText onPress={()=> goToAccusation(item)}>신고</ModalText>
                            <Text>{item.userName},{myName},{item.id}</Text>
                          </ModalView>
                        }
                      </ModalContainer>
                    </Modalize>
                  </Portal>
                </FeedHeader>
                <FeedMain>
                  <FeedImage>
                    <ImageSlider
                      data={[
                        {img: item.imageUrls[0]},
                        {img: 'https://i.pinimg.com/564x/eb/24/52/eb24524c5c645ce204414237b999ba11.jpg'},
                        {img: item.imageUrls[0]},
                      ]}
                      closeIconColor="#fff"
                      preview={true}
                      caroselImageStyle={{resizeMode: 'cover'}}
                      indicatorContainerStyle={{bottom: 0}}
                    />

                    {/*<ImageSource source={item.imageUrls[0]===undefined?{uri:"https://i.pinimg.com/564x/eb/24/52/eb24524c5c645ce204414237b999ba11.jpg"}:{uri:item.imageUrls[0]}} size={FEED_IMAGE_SIZE}/>*/}
                  </FeedImage>
                  <FeedInfo>
                    <LeftInfo>
                      <InfoArea>
                        <TouchableOpacity onPress= {() => setHeartMap((prev) => new Map(prev).set(item.id, !prev.get(item.id)))}>
                          <TouchableOpacity onPress={item.likeYn.toString() === "true" ? () => LikeReverseFeed(item) : () => LikeFeed(item)}>
                            {item.likeYn.toString() === "false" ?
                              <Ionicons  name="md-heart-outline" size={20} color="black"/>
                              :
                              <Ionicons  name="md-heart" size={20} color="red"/>}
                          </TouchableOpacity>
                          {/*{heartMap.get(item.id)?
                            <Ionicons name="md-heart" size={20} color="red"><TouchableOpacity onPress={()=>LikeFeed(item)}/></Ionicons>
                            : <Ionicons  name="md-heart-outline" size={20} color="black"><TouchableOpacity onPress={()=>LikeReverseFeed(item)}/></Ionicons>
                        }*/}
                        </TouchableOpacity>
                        {item.likeYn.toString() === 'true' ?
                          <NumberText>{item.likesCount +1}</NumberText>:<NumberText>{item.likesCount}</NumberText>
                        }
                        {/* {heartMap.get(item.id) === true?<NumberText>{likeCount +1}</NumberText>
                          : <NumberText>{likeCount}</NumberText>}*/}
                      </InfoArea>
                      <InfoArea>
                        <TouchableOpacity onPress={() => goToReply(item)}>
                          <Ionicons name="md-chatbox-ellipses-outline" size={20} color="black" />
                        </TouchableOpacity>
                        <NumberText>{item.commentCount}</NumberText>
                      </InfoArea>
                    </LeftInfo>
                    <RightInfo>
                      <Timestamp>{timeLine(item.created)}</Timestamp>
                    </RightInfo>
                  </FeedInfo>
                  <Content>
                    <Ment>
                      {item.content}
                    </Ment>
                  </Content>
                </FeedMain>
              </>
            )}
          />
        </FeedContainer>
      </Container>
    </>
  );
};
export default Home;