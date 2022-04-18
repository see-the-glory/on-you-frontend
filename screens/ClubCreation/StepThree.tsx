import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components/native";

const Container = styled.SafeAreaView`
  flex: 1;
`;

const Wrapper = styled.View`
  flex: 1;
  justify-content: space-evenly;
  align-items: center;
`;

const TitleText = styled.Text`
  font-size: 28px;
  font-weight: 500;
`;

const SectionView = styled.View`
  width: 100%;
  height: 300px;
`;

const FieldInput = styled.TextInput`
  height: 100%;
  border: 1px;
  border-radius: 10px;
  background-color: #f3f3f3;
  margin-left: 30px;
  margin-right: 30px;
  font-size: 18px;
  padding: 15px;
`;

const NextButton = styled.TouchableOpacity`
  width: 200px;
  height: 40px;
  background-color: #40a798;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
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
  };
};

type StepThreeScreenProps = NativeStackScreenProps<ParamList, "StepThree">;

const StepThree: React.FC<StepThreeScreenProps> = ({
  route: {
    params: { category1, category2, clubName, clubMemberCount },
  },
  navigation: { navigate },
}) => {
  const [clubText, setClubText] = useState("");
  const onChangeText = (text) => setClubText(text);

  const onSubmit = () => {
    console.log(category1);
    console.log(category2);
    console.log(clubName);
    console.log(clubMemberCount);
    console.log(clubText);

    // Post to BE.

    return navigate("Tabs", { screen: "Clubs" });
  };

  return (
    <Container>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Wrapper>
          <TitleText>모임을 소개해주세요.</TitleText>
          <SectionView>
            <FieldInput
              placeholder="모임을 소개해주세요."
              textAlign="left"
              multiline={true}
              maxLength={1000}
              onChangeText={onChangeText}
            />
          </SectionView>
          <NextButton onPress={onSubmit}>
            <ButtonText>완료</ButtonText>
          </NextButton>
        </Wrapper>
      </TouchableWithoutFeedback>
    </Container>
  );
};

export default StepThree;
