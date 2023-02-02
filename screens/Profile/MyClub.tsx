import React, { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import styled from "styled-components/native";
import { Dimensions, Animated } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { UserApi, Club } from "../../api";
import CircleIcon from "../../components/CircleIcon";
import CustomText from "../../components/CustomText";
import { RootState } from "../../redux/store/reducers";

const SCREEN_WIDTH = Dimensions.get("window").width;

const Container = styled.ScrollView``;

const Title = styled.Text`
  font-size: 10px;
  color: #b0b0b0;
  margin: 15px 0 15px 20px;
`;

const TouchableOpacity = styled.TouchableOpacity``;

const MyClubWrap = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: #e9e9e9;
`;

const MyClubBox = styled.View`
  flex-direction: row;
  height: 53px;
  align-items: center;
  background-color: #fff;
  padding-left: 20px;
`;

const MyClubImgBox = styled.View`
  width: 37px;
  height: 37px;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  border: 1px;
  border-color: rgb(255, 255, 255);
  background-color: orange;
  box-shadow: 1px 2px 1px gray;
  margin-right: 10px;
`;

const MyClubImg = styled.Image`
  width: 33px;
  height: 33px;
  border-radius: 50px;
`;

const MyClubTextBox = styled.View`
  padding: 0px 10px;
`;

const MyClubText = styled(CustomText)`
  font-size: 14px;
  font-family: "NotoSansKR-Medium";
`;

const DeleteBox = styled.View`
  width: 53px;
  height: 53px;
  justify-content: center;
  align-items: center;
  background-color: #ff714b;
`;

const MyClub: React.FC<NativeStackScreenProps<any, "ProfileStack">> = ({ navigation: { navigate } }, props) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const {
    isLoading: myClubInfoLoading, // true or false
    data: myClub,
  } = useQuery<Club>(["selectMyClubs", token], UserApi.selectMyClubs);

  const rightSwipe = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
    });

    return (
      <TouchableOpacity onPress={props.handleDelete} activeOpacity={0.6}>
        <DeleteBox>
          <Animated.Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 12,
              transform: [{ translateX: scale }],
            }}
          >
            탈퇴
          </Animated.Text>
        </DeleteBox>
      </TouchableOpacity>
    );
  };

  return (
    <Container>
      <Title>가입한 모임 List</Title>
      {myClub?.data.map((club: Club, index: number) => (
        <MyClubWrap key={index}>
          <Swipeable renderRightActions={rightSwipe}>
            <MyClubBox style={{ width: SCREEN_WIDTH }}>
              <CircleIcon size={37} uri={club.thumbnail} />
              <MyClubTextBox>
                <MyClubText>{club?.name}</MyClubText>
              </MyClubTextBox>
            </MyClubBox>
          </Swipeable>
        </MyClubWrap>
      ))}
      <Title>가입 대기중인 List</Title>
      <MyClubWrap>
        <MyClubBox>
          <MyClubImgBox>
            <MyClubImg />
          </MyClubImgBox>
          <MyClubBox>
            <MyClubText></MyClubText>
          </MyClubBox>
        </MyClubBox>
      </MyClubWrap>
    </Container>
  );
};

export default MyClub;
