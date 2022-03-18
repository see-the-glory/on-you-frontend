import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Alert, Keyboard, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components/native";
import { FontAwesome5 } from "@expo/vector-icons";

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

const FieldView = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-left: 50px;
  margin-top: 30px;
`;

const FieldText = styled.Text`
  font-size: 24px;
`;

const FieldInput = styled.TextInput`
  height: 40px;
  border: 1px;
  border-radius: 5px;
  background-color: #f3f3f3;
  margin-left: 30px;
  margin-right: 15px;
  font-size: 15px;
`;

const IconButton = styled.TouchableOpacity`
  margin-left: 20px;
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
  StepTwo: { category?: string };
};

type StepTwoScreenProps = NativeStackScreenProps<ParamList, "StepTwo">;

const StepTwo: React.FC<StepTwoScreenProps> = ({
  route: {
    params: { category },
  },
  navigation: { navigate },
}) => {
  const [clubName, setClubName] = useState("");
  const [clubMemberCount, setClubMemberCount] = useState(0);
  const [limitCheck, setLimitCheck] = useState(false);
  const onChangeName = (name) => setClubName(name);
  const onChangeCount = (count) => setClubMemberCount(count);

  return (
    <Container>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Wrapper>
          <TitleText>모임 이름과 정원을 설정하세요.</TitleText>
          <SectionView>
            <FieldView>
              <FieldText>모임 이름</FieldText>
              <FieldInput
                clearButtonMode="always"
                placeholder="모임 이름"
                style={{ width: 200 }}
                textAlign="center"
                maxLength={20}
                onChangeText={onChangeName}
                returnKeyType="done"
                returnKeyLabel="done" // for Android
              />
            </FieldView>
            <FieldView>
              <FieldText>모임 정원</FieldText>
              <FieldInput
                keyboardType="numeric"
                editable={!limitCheck}
                defaultValue={limitCheck ? "∞" : ""}
                placeholder="0"
                style={{ width: 80 }}
                textAlign="center"
                maxLength={2}
                onChangeText={onChangeCount}
                returnKeyType="done"
                returnKeyLabel="done" // for Android
              />
              <FieldText>명</FieldText>
            </FieldView>
            <FieldView>
              <FieldText>인원 수 무제한으로 받기</FieldText>
              <IconButton
                onPress={() => {
                  if (!limitCheck) setClubMemberCount(-1);
                  setLimitCheck(!limitCheck);
                }}
              >
                {limitCheck ? (
                  <FontAwesome5 name="check-circle" size={20} color="black" />
                ) : (
                  <FontAwesome5 name="circle" size={20} color="black" />
                )}
              </IconButton>
            </FieldView>
          </SectionView>
          <NextButton
            onPress={() => {
              if (clubName === "") {
                return Alert.alert("모임 이름을 설정하세요.");
              } else if (!limitCheck && clubMemberCount < 1) {
                return Alert.alert("모임 정원은 최소 1명 이상이어야 합니다.");
              } else {
                return navigate("StepThree", {
                  category,
                  clubName,
                  clubMemberCount,
                });
              }
            }}
          >
            <ButtonText>다음</ButtonText>
          </NextButton>
        </Wrapper>
      </TouchableWithoutFeedback>
    </Container>
  );
};

export default StepTwo;
