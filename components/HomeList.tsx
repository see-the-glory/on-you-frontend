import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, Button, Modal, Dimensions, useWindowDimensions, Alert } from "react-native";
import { StatusBar } from "react-native";
import styled from "styled-components/native";
//img
import Icon from "react-native-vector-icons/Ionicons";
import { Category, UserApi, UserInfoResponse } from "../api";
import { Ionicons } from "@expo/vector-icons";
import CustomText from "./CustomText";
import { useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/reducers";

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
const FeedId = styled.Text`
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

interface FeedListProps {
  feedId: number;
  clubId: number;
  clubName: string;
  userId: number;
  userName: string;
  content: string;
  imageUrls: string[] | null;
  hashtags: string | null;
  likeYn: boolean;
  likesCount: number;
  commentCount: number;
  created: string;
  customCursor?: string;
}

const HomeList: React.FC<FeedListProps> = ({ feedId, clubId, clubName, userId, userName, content, imageUrls, hashtags, likesCount, commentCount, created, customCursor, navigation: { navigate } }) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const queryClient = useQueryClient();
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const SCREEN_PADDING_SIZE = 20;
  const FEED_IMAGE_SIZE = SCREEN_WIDTH - SCREEN_PADDING_SIZE * 2;
  const token = useSelector((state: RootState) => state.auth.token);
  const [isPageTransition, setIsPageTransition] = useState<boolean>(false);
  const [heartSelected, setHeartSelected] = useState(false);
  const [likeYn, setLikeYn] = useState<boolean>(false);
  const {
    isLoading: userInfoLoading, // true or false
    data: userInfo,
  } = useQuery<UserInfoResponse>(["getUserInfo", token], UserApi.getUserInfo);

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
      screen: "ModifiyFeed",
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
  return (
    <>
      <FeedHeader>
        <FeedUser onPress={goToProfile}>
          <UserImage
            source={{
              uri: userInfo?.data.thumbnail === null ? "https://k.kakaocdn.net/dn/dpk9l1/btqmGhA2lKL/Oz0wDuJn1YV2DIn92f6DVK/img_110x110.jpg" : userInfo?.data.thumbnail,
            }}
          />
          <UserInfo>
            <UserId>{userName}</UserId>
            <ClubBox>
              <ClubName>{clubName}</ClubName>
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
          {/*<Swiper horizontal dotColor="#E0E0E0" activeDotColor="#FF714B" containerStyle={{ backgroundColor: "black", height: FEED_IMAGE_SIZE }}>
                  <SliderBox images={item.imageUrls} sliderBoxHeight={FEED_IMAGE_SIZE} />
                </Swiper>*/}
          <ImageSource source={imageUrls[0] === undefined ? require("../assets/basic.jpg") : { uri: imageUrls[0] }} size={FEED_IMAGE_SIZE} />
        </FeedImage>
        <FeedInfo>
          <LeftInfo>
            <InfoArea>
              <TouchableOpacity onPress={() => setHeartSelected(!heartSelected)}>
                {heartSelected ? <Ionicons name="md-heart" size={20} color="red" likeYn={true} /> : <Ionicons name="md-heart-outline" size={20} color="black" ikeYn={false} />}
              </TouchableOpacity>
              {heartSelected ? <NumberText>{likesCount + 1} </NumberText> : <NumberText> {likesCount} </NumberText>}
            </InfoArea>
            <InfoArea>
              <TouchableOpacity onPress={() => goToReply()}>
                <Ionicons name="md-chatbox-ellipses-outline" size={20} color="black" />
              </TouchableOpacity>
              <NumberText>{commentCount}</NumberText>
            </InfoArea>
          </LeftInfo>
          <RightInfo>
            <Timestamp>{created}</Timestamp>
          </RightInfo>
        </FeedInfo>
        <Content>
          <Ment>{content}</Ment>
        </Content>
      </FeedMain>
    </>
  );
};
export default HomeList;
