import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, createRef, useLayoutEffect } from "react";
import { Keyboard, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import CustomText from "../../components/CustomText";
import CustomTextInput from "../../components/CustomTextInput";

const Container = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  padding-top: 15px;
`;

const Wrap = styled.View`
  width: 100%;
  padding: 0 20px;
`;

const ButtonWrap = styled.View`
  width: 100%;
`;

const BorderWrap = styled.View`
  width: 100%;
  height: 2px;
  background-color: #d0d0d0;
`;

const Border = styled.View`
  width: 80%;
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
  height: 68px;
  padding-bottom: 8px;
  background-color: ${(props: any) => (props.disabled ? "#d3d3d3" : "#295AF5")};
`;

const ButtonTitle = styled(CustomText)`
  font-family: "NotoSansKR-Bold";
  font-size: 20px;
  line-height: 24px;
  color: #fff;
`;

const Error = styled.Text`
  color: #ff6534;
  font-size: 12px;
  margin-top: 7px;
  margin-bottom: 20px;
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

const ChoiceButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const FieldContentText = styled.Text`
  font-size: 18px;
  margin-right: 10px;
`;

const SkipButton = styled.TouchableOpacity``;

const SkipText = styled(CustomText)`
  color: #8e8e8e;
`;

const JoinStepEight: React.FC<NativeStackScreenProps<any, "AuthStack">> = ({
  navigation: { navigate, setOptions },
  route: {
    params: { name, email, password, sex, birth, phone },
  },
}) => {
  const [check, setCheck] = useState(1);

  const validate = () => {
    navigate("LoginStack", {
      screen: "JoinConfirm",
      name,
      email,
      password,
      sex,
      birth,
      phone,
      church: "시광교회",
    });
  };

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigate("LoginStack", { screen: "JoinStepSeven", name, email, password, sex, birth, phone })}>
          <Entypo name="chevron-thin-left" size={20} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [name, email, password, sex, birth, phone]);

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
          <AskText>출석중인 교회를 알려주세요.</AskText>
          <SubText>멤버 관리와, 소모임 소속 기관을 알기 위함 입니다.</SubText>
          <FieldContentView>
            <FieldContentLine>
              <ChoiceButton onPress={() => setCheck(1)} activeOpacity={0.5}>
                <FieldContentText>{`시광교회`}</FieldContentText>
                {check === 1 ? <MaterialCommunityIcons name="radiobox-marked" size={20} color="#295AF5" /> : <MaterialCommunityIcons name="radiobox-blank" size={20} color="#ABABAB" />}
              </ChoiceButton>
            </FieldContentLine>
            <FieldContentOptionLine>
              <SkipText>{`지금은 시광교회 교인으로만 가입할 수 있습니다.`}</SkipText>
            </FieldContentOptionLine>
          </FieldContentView>
        </Wrap>
        <ButtonWrap>
          <Button onPress={validate}>
            <ButtonTitle>다음</ButtonTitle>
          </Button>
        </ButtonWrap>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default JoinStepEight;
