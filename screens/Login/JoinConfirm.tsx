import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, createRef, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Keyboard, ScrollView, Alert, TouchableWithoutFeedback, useWindowDimensions } from "react-native";
import { useMutation } from "react-query";
import { CommonApi } from "../../api";
import { useDispatch } from "react-redux";
import { Login } from "../../store/Actions";
import styled from "styled-components/native";

const Container = styled.View`
  width: 100%;
  height: 95%;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding-horizontal: 20px;
`;

const Wrap = styled.View`
  width: 100%;
`;

const AskText = styled.Text`
  color: #000000;
  font-size: 20px;
  font-weight: bold;
  margin-top: 24px;
`;

const SubText = styled.Text`
  color: #a0a0a0;
  font-size: 12px;
  margin-top: 7px;
  margin-bottom: 15px;
`;

const Form = styled.View`
  width: 100%;
  margin-top: 25px;
`;

const TitleBorder = styled.View`
  width: 100%;
  padding-bottom: 5px;
  border-bottom-width: 1px;
  border-bottom-color: #b3b3b3;
`;

const Title = styled.Text`
  color: #000000;
  font-size: 16px;
  font-weight: bold;
`;

const TextWrap = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 6px;
`;

const TextTitle = styled.Text`
  color: #838383;
  font-size: 14px;
`;

const TextInfo = styled.Text`
  color: #295af5;
  font-size: 14px;
`;

const Input = styled.TextInput`
  border-bottom-width: 1px;
  border-bottom-color: #b3b3b3;
  margin-top: 47px;
  font-size: 18px;
`;

const Button = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 48px;
  background-color: ${(props) => (props.disabled ? "#d3d3d3" : "#295AF5")};
`;

const ButtonTitle = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: 700;
`;

const JoinConfirm: React.FC<NativeStackScreenProps<any, "AuthStack">> = ({ navigation: { navigate }, route: { params: name } }) => {
  useEffect(() => {
    const getData = async () => {
      try {
        // AsyncStorage에서 inputData에 저장된 값 가져오기
        const value = await AsyncStorage.getItem("userInfo");
        // value에 값이 있으면 콘솔에 찍어줘
        if (value !== null) {
          console.log(value);
        }
      } catch (error) {
        console.log(error);
      }
    };
    // 함수 실행
    getData();
  }, []);

  const goToNext = () => {
    navigate("LoginStack", {
      screen: "JoinStepSuccess",
    });
  };

  return (
    <Container>
      <Wrap>
        <AskText>입력 정보가 모두 일치한가요?</AskText>
        <SubText>잘못 입력된 정보는 뒤로가기로 수정할 수 있습니다.</SubText>

        <Form>
          <TitleBorder>
            <Title>로그인 정보</Title>
          </TitleBorder>
          <TextWrap>
            <TextTitle>이름</TextTitle>
            <TextInfo>{name?.name}</TextInfo>
          </TextWrap>
          <TextWrap>
            <TextTitle>이메일</TextTitle>
            <TextInfo>{name?.email}</TextInfo>
          </TextWrap>
        </Form>
        <Form>
          <TitleBorder>
            <Title>기본 정보</Title>
          </TitleBorder>
          <TextWrap>
            <TextTitle>성별</TextTitle>
            <TextInfo>{name?.sex}</TextInfo>
          </TextWrap>
          <TextWrap>
            <TextTitle>생년월일</TextTitle>
            <TextInfo>{name?.birth}</TextInfo>
          </TextWrap>
          <TextWrap>
            <TextTitle>연락처</TextTitle>
            <TextInfo>{name?.phone}</TextInfo>
          </TextWrap>
          <TextWrap>
            <TextTitle>출석교회</TextTitle>
            <TextInfo>{name?.church}</TextInfo>
          </TextWrap>
        </Form>
        <Form>
          <TitleBorder>
            <Title>관심 카테고리</Title>
          </TitleBorder>
        </Form>
      </Wrap>
      <Wrap>
        <Button onPress={goToNext}>
          <ButtonTitle>일치합니다</ButtonTitle>
        </Button>
      </Wrap>
    </Container>
  );
};

export default JoinConfirm;
