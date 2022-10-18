import React from "react";
import styled from "styled-components/native";
import { FlatList, Image, TextInput, useWindowDimensions, View } from "react-native";
import Swiper from "react-native-swiper";
import { SliderBox } from "react-native-image-slider-box";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { Feed, FeedsResponse } from "../../api";
import CustomText from "../../components/CustomText";

const Container=styled.View`
  flex: 1;
`
const FeedUser = styled.View`
  flex-direction: row;
  padding: 20px 0 0 20px;
`;

const UserInfo = styled.View`
  padding-left: 10px;
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
const FeedImage = styled.View`
  padding: 20px;
`;

const FeedImageUrl=styled.Image`
  width: 100%;
  height: 70%;
`
const Content = styled.View`
  padding: 0 12px 0 12px;
`;

const Ment = styled.TextInput`
  width: 100%;
  color: black;
  font-size: 12px;
`;

const ImageSource = styled.Image<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
`;

const ModifiyPeed=({navigation:{navigate}})=> {
  const token = useSelector((state) => state.AuthReducers.authToken);
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const SCREEN_PADDING_SIZE = 20;
  const FEED_IMAGE_SIZE = SCREEN_WIDTH - SCREEN_PADDING_SIZE * 2;

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
  } = useQuery<FeedsResponse>(["getFeeds"], getFeeds, {
    //useQuery(["getFeeds", token], FeedApi.getFeeds, {
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <Container>
    <FlatList
      keyExtractor={(item: Feed, index: number) => String(index)}
      data={feeds?.data}
      renderItem={({item}:{item:Feed})=>(
        <View>
          <FeedUser>
            <UserImage source={{ uri: "https://i.pinimg.com/564x/9e/d8/4c/9ed84cf3fc04d0011ec4f75c0692c83e.jpg" }} />
            <UserInfo>
              <UserId>{item.userName}</UserId>
              <ClubBox>
                <ClubName>{item.clubName}</ClubName>
              </ClubBox>
            </UserInfo>
          </FeedUser>

          <FeedImage>
            {/*<Swiper horizontal dotColor="#E0E0E0" activeDotColor="#FF714B" containerStyle={{ backgroundColor: "black", height: FEED_IMAGE_SIZE }}>
                  <SliderBox images={item.imageUrls} sliderBoxHeight={FEED_IMAGE_SIZE} />
                </Swiper>*/}
            <ImageSource source={item.imageUrls[0] === undefined ? require("../../assets/basic.jpg") : { uri: item.imageUrls[0] }}  size={FEED_IMAGE_SIZE}/>
          </FeedImage>
          <Content>
            <Ment>{item.content}</Ment>
          </Content>
        </View>
      )}></FlatList>

      </Container>
  );
}

export default ModifiyPeed;