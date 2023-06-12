import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, useLayoutEffect } from "react";
import { Keyboard, TouchableWithoutFeedback, TouchableOpacity, StatusBar } from "react-native";
import styled from "styled-components/native";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomButton from "../../components/BottomButton";

const Container = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
`;

const Wrap = styled.View`
  width: 100%;
  padding: 0px 20px;
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
  font-family: ${(props: any) => props.theme.koreanFontB};
  font-size: 20px;
  margin-top: 24px;
`;

const SubText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  color: #a0a0a0;
  font-size: 13px;
  margin-top: 7px;
`;

const FieldContentView = styled.View`
  margin-top: 36px;
`;

const FieldContentLine = styled.View`
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const FieldContentOptionLine = styled.View`
  justify-content: center;
  align-items: flex-end;
  margin-bottom: 15px;
`;

const FieldContentText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 18px;
  margin-right: 10px;
`;

const SkipButton = styled.TouchableOpacity``;

const SkipText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 12px;
  color: #8e8e8e;
`;

const ChoiceButton = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SignUpSex: React.FC<NativeStackScreenProps<any, "SignUpSex">> = ({
  navigation: { navigate, setOptions, goBack },
  route: {
    params: { name, email, password },
  },
}) => {
  const [approvalMethod, setApprovalMethod] = useState<number>(0);

  const goToNext = () => {
    let sex = null;
    if (approvalMethod === 1) sex = "남성";
    if (approvalMethod === 2) sex = "여성";
    navigate("SignUpStack", {
      screen: "SignUpBirth",
      params: {
        name,
        email,
        password,
        sex,
      },
    });
  };

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => goBack()}>
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
        <StatusBar translucent backgroundColor={"transparent"} barStyle={"dark-content"} />
        <BorderWrap>
          <Border />
        </BorderWrap>
        <Wrap>
          <AskText>성별이 어떻게 되시나요?</AskText>
          <SubText>멤버 관리와, 동명이인 구분을 위함 입니다.</SubText>
          <FieldContentView>
            <FieldContentLine>
              <ChoiceButton onPress={() => setApprovalMethod((prev) => (prev === 1 ? 0 : 1))} activeOpacity={0.5}>
                <FieldContentText>남성</FieldContentText>
                {approvalMethod === 1 ? <MaterialCommunityIcons name="radiobox-marked" size={22} color="#295AF5" /> : <MaterialCommunityIcons name="radiobox-blank" size={22} color="#ABABAB" />}
              </ChoiceButton>
            </FieldContentLine>
            <FieldContentLine>
              <ChoiceButton onPress={() => setApprovalMethod((prev) => (prev === 2 ? 0 : 2))} activeOpacity={0.5}>
                <FieldContentText>여성</FieldContentText>
                {approvalMethod === 2 ? <MaterialCommunityIcons name="radiobox-marked" size={22} color="#295AF5" /> : <MaterialCommunityIcons name="radiobox-blank" size={22} color="#ABABAB" />}
              </ChoiceButton>
            </FieldContentLine>
            <FieldContentLine>
              <ChoiceButton onPress={() => setApprovalMethod((prev) => (prev === 3 ? 0 : 3))} activeOpacity={0.5}>
                <FieldContentText>선택안함</FieldContentText>
                {approvalMethod === 3 ? <MaterialCommunityIcons name="radiobox-marked" size={22} color="#295AF5" /> : <MaterialCommunityIcons name="radiobox-blank" size={22} color="#ABABAB" />}
              </ChoiceButton>
            </FieldContentLine>
            {/* <FieldContentOptionLine>
              <SkipButton onPress={goToNext}>
                <SkipText>{`선택하지 않고 넘어가기 >`}</SkipText>
              </SkipButton>
            </FieldContentOptionLine> */}
          </FieldContentView>
        </Wrap>
        <BottomButton onPress={goToNext} disabled={approvalMethod === 0} title={"다음"} />
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default SignUpSex;
