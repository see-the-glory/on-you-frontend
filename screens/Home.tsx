import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import Swiper from "react-native-swiper";
import { SliderBox } from "react-native-image-slider-box";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { Feed, FeedsResponse } from "../api";

interface ValueInfo {
  str: string;
  isHT: boolean;
  idxArr: number[];
}
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
const LogoText = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: #020202;
`;

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
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

const ModalArea = styled.View``;

const ModalIcon = styled.TouchableOpacity``;

const FeedContainer = styled.View`
  flex: 1;
  width: 100%;
  margin-bottom: 30px;
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
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  //현재시간
  let today = new Date("2022-08-03T13:26:43.005981"); // today 객체에 Date()의 결과를 넣어줬다
  let time = {
    year: today.getFullYear(), //현재 년도
    month: today.getMonth() + 1, // 현재 월
    date: today.getDate(), // 현제 날짜
    hours: today.getHours(), //현재 시간
    minutes: today.getMinutes(), //현재 분
  };
  let timestring = `${time.year}년 ${time.month}월 ${time.date}일`;

  const getFeeds = () => {
    return fetch(`http://3.39.190.23:8080/api/feeds`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());
  };

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const SCREEN_PADDING_SIZE = 20;
  const FEED_IMAGE_SIZE = SCREEN_WIDTH - SCREEN_PADDING_SIZE * 2;
  const token = useSelector((state) => state.AuthReducers.authToken);
  const {
    data: feeds,
    isLoading: feedsLoading,
    refetch: feedRefetch,
  } = useQuery<FeedsResponse>(["getFeeds"], getFeeds, {
    //useQuery(["getFeeds", token], FeedApi.getFeeds, {
    onSuccess: (res) => {},
    onError: (err) => {
      console.log(`[getFeeds error] ${err}`);
    },
  });

  //heart선택
  const [heartSelected, setHeartSelected] = useState<boolean>(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const goToReply = () => {
    navigate("HomeStack", {
      screen: "ReplyPage",
    });
  };

  const goToClub = () => {
    navigate("HomeStack", {
      screen: "MyClubSelector",
    });
  };

  const goToAlarm = () => {
    navigate("HomeStack", {
      screen: "AlarmPage",
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    feedRefetch();
    setRefreshing(false);
  };

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
          <Ionicons name="md-notifications-outline" onPress={goToAlarm} size={19} color="black" />
          <MaterialIcons name="add-photo-alternate" onPress={goToClub} style={{ paddingLeft: "2.5%" }} size={19} color="black" />
        </SubView>
      </HeaderView>
      <FlatList
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={{ paddingHorizontal: SCREEN_PADDING_SIZE }}
        keyExtractor={(item: Feed, index: number) => String(index)}
        data={feeds?.data}
        renderItem={({ item, index }: { item: Feed; index: number }) =>
          item.imageUrls ? (
            <FeedContainer>
              <FeedHeader>
                <FeedUser>
                  <UserImage source={{ uri: "https://i.pinimg.com/564x/9e/d8/4c/9ed84cf3fc04d0011ec4f75c0692c83e.jpg" }} />
                  <UserInfo>
                    <UserId>{item.userName}</UserId>
                    <ClubBox onPress={goToReply}>
                      <ClubName>{item.clubName}</ClubName>
                    </ClubBox>
                  </UserInfo>
                </FeedUser>
                <ModalArea>
                  <ModalIcon onPress={toggleModal}>
                    <Ionicons name="ellipsis-vertical" size={20} color={"black"} />
                  </ModalIcon>
                </ModalArea>
              </FeedHeader>

              <FeedMain>
                {/* <FeedImage>
                  <Swiper horizontal dotColor="#E0E0E0" activeDotColor="#FF714B" containerStyle={{ backgroundColor: "black", height: FEED_IMAGE_SIZE }}>
                    <SliderBox images={item.imageUrls} sliderBoxHeight={FEED_IMAGE_SIZE} />
                  </Swiper>
                </FeedImage> */}
                <FeedInfo>
                  <LeftInfo>
                    <InfoArea>
                      <TouchableOpacity onPress={() => setHeartSelected(!heartSelected)}>
                        {heartSelected ? <Ionicons name="md-heart" size={20} color="red" /> : <Ionicons name="md-heart-outline" size={20} color="black" />}
                      </TouchableOpacity>
                      <NumberText>{item.likesCount}</NumberText>
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
                <Content>
                  <Ment>{item.content}</Ment>
                </Content>
              </FeedMain>
            </FeedContainer>
          ) : (
            <></>
          )
        }
      ></FlatList>
    </Container>
  );
};
export default Home;
