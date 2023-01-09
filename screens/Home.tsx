import { createIconSetFromFontello, Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
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
  Animated,
} from "react-native";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "react-query";
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
  Club,
  ClubsParams,
} from "../api";
import CustomText from "../components/CustomText";
import { FeedData, HomeScreenProps } from "../types/feed";
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
  top: ${Platform.OS === "android" ? 5 : 0}%;
`;

const HeaderView = styled.View<{ size: number }>`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${(props:any) => props.size}px 0 10px;
  margin-bottom: 20px;
`;

const SubView = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: 7px;
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
  width: 40px;
  height: 40px;
  border-radius: 100px;
  border-style: solid;
  border-color: #dddddd;
  border-width: 1.5px;
  background-color: #c4c4c4;
`;

const UserId = styled(CustomText)`
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

const ClubName = styled(CustomText)`
  font-size: 10px;
  font-weight: 500;
  color: white;
`;

//ModalStyle
//ModalStyle
const ModalArea = styled.View`
  flex: 1;
`;

const ModalIcon = styled.TouchableOpacity`
  top: 50%;
`;

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

const ModalText = styled(CustomText)`
  font-weight: bold;
  text-align: center;
  font-size: 18px;
  padding: 30px 0 0 0;
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
  margin-bottom: ${Platform.OS === "ios" ? 0 : 30}px;
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
  padding-bottom: 2px;
`;
const FeedMain = styled.View``;
const FeedImage = styled.View`
`;
const FeedInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 7px 5px 5px 5px;
`;
const LeftInfo = styled.View`
  flex-direction: row;
`;
const InfoArea = styled.View`
  flex-direction: row;
  align-items: center;
  padding-right: 10px;
`;

const LikeClick = styled.TouchableOpacity``;

const NumberText = styled(CustomText)`
  font-size: 12px;
  font-weight: 300;
  padding-left: 5px;
`;
const RightInfo = styled.View``;
const Timestamp = styled(CustomText)`
  color: #9a9a9a;
  font-size: 12px;
`;

const Content = styled.View`
  padding: 0 12px 0 10px;
`;

const Ment = styled(CustomText)`
  width: 100%;
  color: black;
  font-size: 14px;
`;

const ImageSource = styled.Image<{ size: number }>`
  width: ${(props:any) => props.size}px;
  height: ${(props:any) => props.size}px;
`;

interface HeartType {
  feedId: number;
  heart: boolean;
}

const Home: React.FC<HomeScreenProps> = ({
                                           navigation,
                                           route: {
                                             params: { feedData },
                                           },
                                         }) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const SCREEN_PADDING_SIZE = 0;
  const FEED_IMAGE_SIZE = SCREEN_WIDTH - SCREEN_PADDING_SIZE * 2;
  const token = useSelector((state: any) => state.AuthReducers.authToken);
  const [isPageTransition, setIsPageTransition] = useState<boolean>(false);
  const [modalFeedData, setModalFeedData] =  useState<any>('');
  const [imageURI, setImageURI] = useState<any>([]);
  //모달
  const modalizeRef = useRef<Modalize>(null);
  const onOpen = (feedData: Feed) => {
    console.log("Before Modal Passed FeedId:", feedData.id);
    setModalFeedData(feedData);
    modalizeRef?.current?.open(feedData.id);
  };

  //heart선택
  const [heartMap, setHeartMap] = useState(new Map());
  const [feedImageLength,setImageLength] = useState<any>();
  //getFeeds ( 무한 스크롤 )
  const {
    isLoading: feedsLoading,
    data: feeds,
    isRefetching: isRefetchingFeeds,
    hasNextPage,
    refetch: feedsRefetch,
    fetchNextPage,
  } = useInfiniteQuery<FeedsResponse>(["feeds", { token }], FeedApi.getFeeds, {
    getNextPageParam: (currentPage) => {
      if (currentPage) {
        return currentPage.hasNext === false ? null : currentPage.responses?.content[currentPage.responses?.content.length - 1].customCursor;
      }
    },
    onSuccess: (res) => {
      console.log('getFeeds onSuccess')
      // console.log("res.pages[0].responses:", res.pages[0].responses)
      setIsPageTransition(false);
      let heartDataMap = new Map();

/*      for (let i = 0; i < res?.data?.length; ++i) {
        heartDataMap.set(res?.data[i].id, false);
      }
      setHeartMap(heartDataMap);*/
      let array=[]
      for(let i=0; i<res.pages[0].responses.content.length; i++){
        // for(let v=0; v<res?.pages[0]?.responses?.content[i]?.imageUrls; v++){
        array.push(feeds?.pages[0]?.responses?.content[i]?.imageUrls)
        // }
      }
      setImageURI(array)
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const [fetchedFeedList, setFetchedFeedList] = useState(feeds?.pages.map((page) => page?.responses?.content).flat())

  const loadMore = () => {
    if (hasNextPage) fetchNextPage();
    console.log('loadMore')
  };

  //User
  const {
    isLoading: userInfoLoading, // true or false
    data: userInfo,
  } = useQuery<UserInfoResponse>(["getUserInfo", token], UserApi.getUserInfo);
  let myName = userInfo?.data?.name;
  let myId = userInfo?.data?.id;

  //Like
  const LikeMutation = useMutation(FeedApi.likeCount, {
    onSuccess: (res) => {
      if (res.status === 200) {
        // onRefresh();
        console.log(res);
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

  const LikeFeed = (feedData: Feed) => {
    if (feedData.likeYn.toString() === "true") {
      feedData.likeYn = false;
    } else {
      feedData.likeYn = true;
    }
    const data = {
      id: feedData.id,
    };

    const likeRequestData: FeedLikeRequest = {
      data,
      token,
    };
    LikeMutation.mutate(likeRequestData);
    console.log(data);
  };

  const FeedDeleteMutation = useMutation(FeedApi.feedDelete, {
    onSuccess: (res) => {
      if (res.status === 200) {
        console.log(res);
        onRefresh();
        modalizeRef.current?.close();
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

  /**FeedDelete*/
  const FeedDelete = (feedData: Feed) => {
    const data = {
      id: feedData.id,
    };

    const likeRequestData: FeedLikeRequest = {
      data,
      token,
    };
    FeedDeleteMutation.mutate(likeRequestData);
    console.log(data);
  };

  const goToReply = (feedData: Feed) => {
    navigation.navigate("HomeStack", {
      screen: "ReplyPage",
      feedData,
    });
  };

  const goToModifiy = (feedData: Feed) => {
    console.log("After Modal passed feedId:",feedData.id)
    navigation.navigate("HomeStack", {
      screen: "ModifiyFeed",
      feedData,
    });
    modalizeRef.current?.close();
  };

  const goToClubStack = (clubData: Club) => {

    let clubNagivateData: Club = {
      id: clubData.clubId
    }

    console.log("clubNagivateData", clubNagivateData);
    return navigation.navigate("ClubStack", {
      screen: "ClubTopTabs",
      clubData: clubNagivateData,
    });
  };

  const goToClub = () => {
    return navigation.navigate("HomeStack", {
      screen: "MyClubSelector",
      userId: myId,
    });
  };

  const goToAccusation = (feedData: Feed) => {
    navigation.navigate("HomeStack", {
      screen: "Accusation",
      feedData,
    });
    modalizeRef.current?.close();
  };

  const deleteCheck = (feedData: Feed) => {
    console.log("After Modal passed feedId:", feedData.id);
    Alert.alert(
      "게시글을 삭제하시겠어요?",
      "정말로 해당 게시물을 삭제하시겠습니까?",
      [
        {
          text: "아니요",
          onPress: () => console.log("삭제 Api 호출"),
          style: "cancel",
        },
        { text: "네", onPress: () => FeedDelete(feedData) },
      ],
      { cancelable: false }
    );
  };
  const onRefresh = async () => {
    console.log("onRefresh executed");
    setRefreshing(true);
    await queryClient.refetchQueries(["feeds"]).then(() => {
      setRefreshing(false);
    });
  };

  const unsubscribe = navigation.addListener("focus", () => {
    onRefresh();
  });
  useEffect(() => {
    return () => unsubscribe();
  });

  //시간측정
  const timeLine = (date: any) => {
    const start:any = new Date(date);
    const end:any = new Date(); // 현재 날짜

    let diff = end - start; // 경과 시간

    const times = [
      { time: "분", milliSeconds: 1000 * 60 },
      { time: "시간", milliSeconds: 1000 * 60 * 60 },
      { time: "일", milliSeconds: 1000 * 60 * 60 * 24 },
      { time: "개월", milliSeconds: 1000 * 60 * 60 * 24 * 30 },
      { time: "년", milliSeconds: 1000 * 60 * 60 * 24 * 365 },
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
  };

  const loading = feedsLoading && userInfoLoading;
  return loading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <>
      <Container>
        <FeedContainer>
          <HeaderView size={SCREEN_PADDING_SIZE}>
            <SubView>
              <LogoImage source={{ uri: "https://i.pinimg.com/564x/cd/c9/a5/cdc9a5ffec176461e7a1503d3b2553d4.jpg" }} />
              <LogoText>OnYou</LogoText>
            </SubView>
            <SubView>
              <MaterialIcons name="add-photo-alternate" onPress={goToClub} style={{ left: 9 }} size={22} color="black" />
            </SubView>
          </HeaderView>
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onEndReached={loadMore}
            onEndReachedThreshold={2}
            data={feeds?.pages.map((page) => page?.responses?.content).flat()}
            disableVirtualization={false}
            keyExtractor={(item: Feed, index: number) => String(index)}
            renderItem={({ item, index }: { item: Feed; index: number }) => (
              <>
                <FeedHeader>
                  <FeedUser>
                    <UserImage
                      source={{
                        uri: userInfo?.data.thumbnail
                      }}
                    />
                    <UserInfo>
                      <UserId>{item.userName}</UserId>
                      <ClubBox>
                        <ClubName onPress={() => goToClubStack(item)} >{item.clubName}</ClubName>
                      </ClubBox>
                    </UserInfo>
                  </FeedUser>
                  <TouchableOpacity>
                    <ModalArea>
                      <ModalIcon
                        onPress={() => {onOpen(item)}}>
                        <Ionicons name="ellipsis-vertical" size={20} color={"black"} />
                      </ModalIcon>
                      <Portal>
                        { modalFeedData.userId === myId ? (
                          <Modalize
                            ref={modalizeRef}
                            modalHeight={150}
                            handlePosition="inside"
                          >
                            <ModalContainer key={index}>
                              <ModalView>
                                <ModalText onPress={() => goToModifiy(modalFeedData)}>수정</ModalText>
                                <ModalText style={{ color: "red" }} onPress={() => deleteCheck(modalFeedData)}>
                                  삭제
                                </ModalText>
                              </ModalView>
                            </ModalContainer>
                          </Modalize>
                        ):(
                          <Modalize
                            ref={modalizeRef}
                            modalHeight={75}
                            handlePosition="inside"
                          >
                            <ModalContainer key={index}>
                              <ModalView>
                                <ModalText onPress={()=> goToAccusation(modalFeedData)}>신고</ModalText>
                              </ModalView>
                            </ModalContainer>
                          </Modalize>
                        )}
                      </Portal>
                    </ModalArea>
                  </TouchableOpacity>
                </FeedHeader>
                <FeedMain>
                  <FeedImage>
                    {item.imageUrls?.length > 1 ?
                      (
                         <ImageSlider
                            data={item.imageUrls?.map((url)=>{return {img: url}})}
                            preview={false}
                            caroselImageContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
                            caroselImageStyle={{resizeMode: 'center',height: 380, left: -20}}
                            activeIndicatorStyle={{backgroundColor: 'orange'}}
                            indicatorContainerStyle={{ bottom: 0 }}
                            />
                    ):(
                      <ImageSource source={{uri: item.imageUrls[0]}} size={380}/>
                    )}
                   </FeedImage>
                  <FeedInfo>
                    <LeftInfo>
                      <InfoArea>
                        <TouchableOpacity onPress={() => setHeartMap((prev) => new Map(prev).set(item.id, !prev.get(item.id)))}>
                          <TouchableOpacity onPress={()=>LikeFeed(item)}>
                            {item.likeYn.toString() === "false" ? <Ionicons name="md-heart-outline" size={20} color="black" /> : <Ionicons name="md-heart" size={20} color="red" />}
                          </TouchableOpacity>
                        </TouchableOpacity>
                        {item.likeYn.toString() === "true" ? <NumberText>{item.likesCount + 1}</NumberText> : <NumberText>{item.likesCount}</NumberText>}
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
                    <Ment>{item.content}</Ment>
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
