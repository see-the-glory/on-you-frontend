import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, useLayoutEffect } from "react";
import { Keyboard, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Entypo } from "@expo/vector-icons";
import CustomText from "../../components/CustomText";
import CustomTextInput from "../../components/CustomTextInput";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Container = styled.View`
  width: 100%;
  height: 95%;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding-horizontal: 20px;
  padding-top: 30px;
`;

const Wrap = styled.View`
  width: 100%;
`;

const BorderWrap = styled.View`
  width: 100%;
  height: 2px;
  background-color: #d0d0d0;
`;

const Border = styled.View`
  width: 50%;
  height: 2px;
  background-color: #295af5;
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
  background-color: #295af5;
`;

const ButtonTitle = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: 700;
`;

const FieldContentView = styled.View`
  margin-top: 36px;
`;

const FieldContentLine = styled.View`
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const FieldContentText = styled.Text`
  font-size: 18px;
  margin-right: 10px;
`;

const ChoiceButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const JoinStepFive: React.FC<NativeStackScreenProps<any, "AuthStack">> = ({
  navigation: { navigate, setOptions },
  route: {
    params: { name, email, password },
  },
}) => {
  const [approvalMethod, setApprovalMethod] = useState<number>(0);

  const goToNext = () => {
    navigate("LoginStack", {
      screen: "JoinStepSix",
      name,
      email,
      password,
      sex: approvalMethod === 0 ? "남성" : "여성",
    });
  };

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigate("LoginStack", { screen: "JoinStepFour", name, email, password })}>
          <Entypo name="chevron-thin-left" size={20} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [name, email, password]);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <Container>
        <Wrap>
          <BorderWrap>
            <Border></Border>
          </BorderWrap>
          <AskText>성별이 어떻게 되시나요?</AskText>
          <SubText>멤버 관리와, 동명이인 구분을 위함 입니다.</SubText>
          <FieldContentView>
            <FieldContentLine>
              <ChoiceButton onPress={() => setApprovalMethod(0)} activeOpacity={0.5}>
                <FieldContentText> 남성</FieldContentText>
                {approvalMethod ? <MaterialCommunityIcons name="radiobox-blank" size={20} color="#ABABAB" /> : <MaterialCommunityIcons name="radiobox-marked" size={20} color="#295AF5" />}
              </ChoiceButton>
            </FieldContentLine>
            <FieldContentLine>
              <ChoiceButton onPress={() => setApprovalMethod(1)} activeOpacity={0.5}>
                <FieldContentText> 여성</FieldContentText>
                {approvalMethod ? <MaterialCommunityIcons name="radiobox-marked" size={20} color="#295AF5" /> : <MaterialCommunityIcons name="radiobox-blank" size={20} color="#ABABAB" />}
              </ChoiceButton>
            </FieldContentLine>
          </FieldContentView>
        </Wrap>
        <Wrap>
          <Button onPress={goToNext}>
            <ButtonTitle>다음</ButtonTitle>
          </Button>
        </Wrap>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default JoinStepFive;
