import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Dimensions, FlatList, Modal, TouchableOpacity, useWindowDimensions, View } from "react-native";
import MentionHashtagTextView from "react-native-mention-hashtag-text";
import { useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { Feed, FeedsParams, FeedsResponse, ReplyResponse, UserApi, UserInfoResponse } from "../api";
import CustomText from "../components/CustomText";
import { HomeScreenProps } from "../types/feed";

const Container = styled.SafeAreaView`
  flex: 1;
`;

const HeaderView = styled.View<{ size: number }>`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px ${(props) => props.size}px 10px ${(props) => props.size}px;
  margin-bottom: 10px;
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

const ClubBox = styled.View`
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
  margin: 20px 0 10px 0;
`;

const FeedUser = styled.TouchableOpacity`
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

const Home: React.FC<HomeScreenProps> = ({ navigation: { navigate},route:{params:{userId}} }) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const queryClient = useQueryClient();
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const SCREEN_PADDING_SIZE = 20;
  const FEED_IMAGE_SIZE = SCREEN_WIDTH - SCREEN_PADDING_SIZE * 2;
  const token = useSelector((state) => state.AuthReducers.authToken);
  const [isPageTransition, setIsPageTransition] = useState<boolean>(false);

  // const [userId, setUserId] = useState<string>("");

  const [params, setParams] = useState<FeedsParams>({
    token,
  });

  const getFeeds = () => {
    return fetch(`http://3.39.190.23:8080/api/feeds`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());
  };

  const likeCount = () =>{
    return fetch(`http://3.39.190.23:8080/api/feeds/${userId}/likes`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());
  }

  
  const likeCountReverse = () =>{
    return fetch(`http://3.39.190.23:8080/api/feeds/${userId}/likes`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());
  }

  //heart선택
  const [heartMap, setHeartMap] = useState(new Map());

  //피드
  const {
    isLoading: feedsLoading,
    data: feeds,
    isRefetching: isRefetchingClubs,
  } = useQuery<FeedsResponse>(["getFeeds"], getFeeds, {
    //useQuery(["getFeeds", token], FeedApi.getFeeds, {
    onSuccess: (res) => {
      setIsPageTransition(false);

      let heartDataMap = new Map();

      for (let i = 0; i < res.data.length; ++i) {
        heartDataMap.set(res.data[i].id, false);
        //나중에 api 호출했을때는 false자리에 id 불러오듯이 값 받아와야함.
      }
      setHeartMap(heartDataMap);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  //User
  const {
    isLoading: userInfoLoading, // true or false
    data: userInfo,
  } = useQuery<UserInfoResponse>(["getUserInfo", token], UserApi.getUserInfo);

  console.log(userInfo?.data);

  //commentCount
  const {
    isLoading: commentPlusLoading,
    data: commentPlusCount,
  }=useQuery<ReplyResponse>(["getCommentCount", token], likeCount)

  const {
    isLoading: commentReverseLoading,
    data: commentReverseCount,
  }=useQuery<ReplyResponse>(["getCommentCount", token], likeCountReverse)


  console.log(commentPlusCount?.data)
  console.log(commentReverseCount?.data)

  const feedSize = Math.round(SCREEN_WIDTH / 3) - 1;

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

  const goToClub = () => {
    navigate("HomeStack", {
      screen: "MyClubSelector",
      userId,
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

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries(["feeds"]);
    setRefreshing(false);
  };

  return (
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
          refreshing={refreshing}
          onRefresh={onRefresh}
          keyExtractor={(item: Feed, index: number) => String(index)}
          // data={feeds?.pages.map((page) => page?.responses?.content).flat()}
          data={feeds?.data}
          renderItem={({ item, index }: { item: Feed; index: number }) => (
            <>
              <FeedHeader>
                <FeedUser onPress={goToProfile}>
                  <UserImage
                    source={{
                      uri: userInfo?.data.thumbnail === null ? "https://k.kakaocdn.net/dn/dpk9l1/btqmGhA2lKL/Oz0wDuJn1YV2DIn92f6DVK/img_110x110.jpg" : userInfo?.data.thumbnail,
                    }}
                  />
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
                        </ModalView>
                      </CenteredView>
                    </Modal>
                  </View>
                </ModalArea>
              </FeedHeader>
              <FeedMain>
                <FeedImage>
                  <ImageSource source={item.imageUrls[0] === undefined ? require("../assets/basic.jpg") : { uri: item.imageUrls[0] }} size={FEED_IMAGE_SIZE} />
                </FeedImage>
                <FeedInfo>
                  <LeftInfo>
                    <InfoArea>
                      <TouchableOpacity onPress={() => setHeartMap((prev) => new Map(prev).set(item.id, !prev.get(item.id)))}>
                        {heartMap.get(item.id) ? <Ionicons name="md-heart" size={20} color="red" likeYn={true} /> : <Ionicons name="md-heart-outline" size={20} color="black" likeYn={false} />}
                      </TouchableOpacity>
                      {heartMap.get(item.id) ? <NumberText>{commentPlusCount?.data} </NumberText> : <NumberText> {commentReverseCount?.data} </NumberText>}
                    </InfoArea>
                    <InfoArea>
                      <TouchableOpacity onPress={() => goToReply()}>
                        <Ionicons name="md-chatbox-ellipses-outline" size={20} color="black" />
                      </TouchableOpacity>
                      <NumberText>{item.commentCount}</NumberText>
                    </InfoArea>
                  </LeftInfo>
                  <RightInfo>
                    <Timestamp>{item.created}</Timestamp>
                  </RightInfo>
                </FeedInfo>
                <Content>
                  <Ment>
                    <MentionHashtagTextView key={feeds}>{item.content}</MentionHashtagTextView>
                  </Ment>
                </Content>
              </FeedMain>
            </>
          )}
        ></FlatList>
      </FeedContainer>
    </Container>
  );
};
export default Home;
