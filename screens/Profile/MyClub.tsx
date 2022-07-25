import React, { useState } from "react";
import styled from "styled-components/native";
import { StyleSheet, Dimensions, Animated } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";

const SCREEN_WIDTH = Dimensions.get("window").width;

const Container = styled.SafeAreaView``;

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
  padding: 16px;
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
  background-color: white;
  box-shadow: 1px 2px 1px gray;
  margin-right: 10px;
`;

const MyClubImg = styled.Image`
  width: 33px;
  height: 33px;
  border-radius: 50px;
  background-color: red;
`;

const MyClubTextBox = styled.View``;

const MyClubText = styled.Text`
  font-weight: 600;
`;

const DeleteBox = styled.View`
  width: 53px;
  height: 53px;
  justify-content: center;
  align-items: center;
  background-color: #ff714b;
`;

const MyClub = (props) => {
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
      <MyClubWrap>
        <Swipeable renderRightActions={rightSwipe}>
          <MyClubBox style={{ width: SCREEN_WIDTH }}>
            <MyClubImgBox>
              <MyClubImg />
            </MyClubImgBox>
            <MyClubTextBox>
              <MyClubText>온유 프로젝트</MyClubText>
            </MyClubTextBox>
          </MyClubBox>
        </Swipeable>
      </MyClubWrap>
      <MyClubWrap>
        <Swipeable renderRightActions={rightSwipe}>
          <MyClubBox style={{ width: SCREEN_WIDTH }}>
            <MyClubImgBox>
              <MyClubImg />
            </MyClubImgBox>
            <MyClubTextBox>
              <MyClubText>덕 모임</MyClubText>
            </MyClubTextBox>
          </MyClubBox>
        </Swipeable>
      </MyClubWrap>
    </Container>
  );
};

export default MyClub;
