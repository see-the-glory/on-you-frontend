import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, useEffect, createRef, useLayoutEffect } from "react";
import { Keyboard, TouchableWithoutFeedback, TouchableOpacity, StatusBar } from "react-native";
import styled from "styled-components/native";
import { Entypo } from "@expo/vector-icons";
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
  padding: 0px 20px;
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
  width: 70%;
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
  border-bottom-color: ${(props: any) => (props.error ? "#ff6534" : "#b3b3b3")};
  margin-top: 47px;
  font-size: 18px;
`;

const Button = styled.TouchableOpacity<{ disabled: boolean }>`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 68px;
  padding-bottom: 8px;
  background-color: ${(props: any) => (props.disabled ? "#D3D3D3" : "#295af5")};
`;

const ButtonTitle = styled(CustomText)`
  font-family: "NotoSansKR-Bold";
  font-size: 20px;
  line-height: 24px;
  color: #fff;
`;

const ErrorView = styled.View`
  height: 25px;
`;

const Error = styled.Text`
  color: #ff6534;
  font-size: 12px;
  margin-top: 7px;
  margin-bottom: 20px;
`;

const FieldContentOptionLine = styled.View`
  justify-content: center;
  align-items: flex-end;
  margin-bottom: 15px;
`;

const SkipButton = styled.TouchableOpacity``;

const SkipText = styled(CustomText)`
  color: #8e8e8e;
`;

const JoinStepSeven: React.FC<NativeStackScreenProps<any, "JoinStepSeven">> = ({
  navigation: { navigate, setOptions },
  route: {
    params: { name, email, password, sex, birth },
  },
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const phoneReg = /^(01[0|1|6|7|8|9]?)-([0-9]{4})-([0-9]{4})$/;

  useEffect(() => {
    if (phoneNumber.length === 10) {
      setPhoneNumber(phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3"));
    } else if (phoneNumber.length === 11) {
      setPhoneNumber(phoneNumber.replace(/-/g, "").replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3"));
    } else if (phoneNumber.length === 12) {
      setPhoneNumber(phoneNumber.replace(/-/g, "").replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3"));
    } else if (phoneNumber.length === 13) {
      setPhoneNumber(phoneNumber.replace(/-/g, "").replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3"));
    }
  }, [phoneNumber]);

  const validate = () => {
    if (!phoneReg.test(phoneNumber)) {
      return;
    }
    navigate("SignUpStack", {
      screen: "JoinStepEight",
      name,
      email,
      password,
      sex,
      birth,
      phone: phoneNumber,
    });
  };

  const goToNext = () => {
    navigate("SignUpStack", {
      screen: "JoinStepEight",
      name,
      email,
      password,
      sex,
      birth,
      phone: null,
    });
  };

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigate("SignUpStack", { screen: "JoinStepSix", name, email, password, sex, birth })}>
          <Entypo name="chevron-thin-left" size={20} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [name, email, password, sex, birth]);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <Container>
        <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
        <Wrap>
          <BorderWrap>
            <Border></Border>
          </BorderWrap>
          <AskText>연락처는 어떻게 되시나요?</AskText>
          <SubText>연락처는 ID 찾기에 사용됩니다.</SubText>
          <Input
            placeholder="010-1234-1234"
            placeholderTextColor={"#B0B0B0"}
            keyboardType="numeric"
            maxLength={13}
            onChangeText={(phone: string) => setPhoneNumber(phone)}
            value={phoneNumber}
            error={phoneNumber !== "" && !phoneReg.test(phoneNumber)}
            clearButtonMode="always"
          />
          <ErrorView>{phoneNumber !== "" && !phoneReg.test(phoneNumber) ? <Error>입력을 다시 한번 확인해주세요.</Error> : <></>}</ErrorView>
          <FieldContentOptionLine>
            <SkipButton onPress={goToNext}>
              <SkipText>선택하지 않고 넘어가기</SkipText>
            </SkipButton>
          </FieldContentOptionLine>
        </Wrap>
        <ButtonWrap>
          <Button onPress={validate} disabled={!phoneReg.test(phoneNumber)}>
            <ButtonTitle>다음</ButtonTitle>
          </Button>
        </ButtonWrap>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default JoinStepSeven;
