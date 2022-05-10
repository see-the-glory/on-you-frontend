import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components/native";

const Container = styled.ScrollView`
  flex: 1;
`;

const HeaderView = styled.View`
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 20px;
`;

const H1 = styled.Text`
  font-size: 28px;
  font-weight: 900;
  margin-bottom: 15px;
`;

const H2 = styled.Text`
  font-size: 18px;
  color: #5c5c5c;
`;

const SectionView = styled.View`
  width: 100%;
`;

const FieldView = styled.View`
  justify-content: center;
  margin-left: 50px;
  margin-right: 50px;
  margin-top: 30px;
`;

const FieldNameText = styled.Text`
  font-size: 21px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const ExampleText = styled.Text`
  font-size: 12px;
  margin-left: 5px;
  color: #8c8c8c;
`;

const BrifeTextInput = styled.TextInput`
  border-radius: 10px;
  background-color: #f3f3f3;
  font-size: 14px;
  padding: 15px;
  margin-bottom: 10px;
`;

const DetailTextInput = styled.TextInput`
  height: 130px;
  border-radius: 10px;
  background-color: #f3f3f3;
  font-size: 14px;
  padding: 15px;
`;

const NextButton = styled.TouchableOpacity`
  width: 200px;
  height: 40px;
  background-color: #40a798;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  margin-bottom: 80px;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: white;
`;

type ParamList = {
  StepThree: {
    category1: number;
    category2: number;
    clubName: string;
    clubMemberCount: Number;
    approvalMethod: Number;
    imageURI: string | null;
  };

  Tabs: {
    screen: string;
  };
};

type StepThreeScreenProps = NativeStackScreenProps<ParamList, "StepThree">;

const StepThree: React.FC<StepThreeScreenProps> = ({
  route: {
    params: {
      category1,
      category2,
      clubName,
      clubMemberCount,
      approvalMethod,
      imageURI,
    },
  },
  navigation: { navigate },
}) => {
  const [briefIntroText, setBriefIntroText] = useState<string>("");
  const [detailIntroText, setDetailIntroText] = useState<string>("");

  const onSubmit = () => {
    console.log("category1: " + category1);
    console.log("category2: " + category2);
    console.log("clubName: " + clubName);
    console.log("clubMemberCount: " + clubMemberCount);
    console.log("briefIntroText: " + briefIntroText);
    console.log("detailIntroText " + detailIntroText);
    console.log("approvalMethod " + approvalMethod);
    console.log("imageURI " + imageURI);

    // Post to BE.

    return navigate("Tabs", { screen: "Clubs" });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <HeaderView>
          <H1>모임 소개</H1>
          <H2>모임을 소개해주세요.</H2>
        </HeaderView>
        <SectionView>
          <FieldView>
            <FieldNameText>간단 소개</FieldNameText>
            <BrifeTextInput
              placeholder="30자 이내로 간단 소개글을 적어주세요."
              textAlign="left"
              multiline={true}
              maxLength={30}
              textAlignVertical="top"
              onChangeText={(text) => setBriefIntroText(text)}
            />
            <ExampleText>
              ex) 매일 묵상훈련과 책모임을 함께하는 '경청'입니다!
            </ExampleText>
          </FieldView>
          <FieldView>
            <FieldNameText>상세 소개</FieldNameText>
            <DetailTextInput
              placeholder="모임의 상세 소개글을 적어주세요.
              ex) 모임시간, 모임방식, 안내사항 등"
              textAlign="left"
              multiline={true}
              maxLength={1000}
              textAlignVertical="top"
              onChangeText={(text) => setDetailIntroText(text)}
            />
          </FieldView>
        </SectionView>
        <NextButton onPress={onSubmit}>
          <ButtonText>완료</ButtonText>
        </NextButton>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default StepThree;
