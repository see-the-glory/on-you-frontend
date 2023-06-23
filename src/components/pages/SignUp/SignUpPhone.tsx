import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { Keyboard, TouchableWithoutFeedback, TouchableOpacity, StatusBar } from "react-native";
import styled from "styled-components/native";
import { Entypo } from "@expo/vector-icons";
import BottomButton from "@components/atoms/BottomButton";
import { SignUpStackParamList } from "@navigation/SignupStack";

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
  width: 70%;
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

const Input = styled.TextInput<{ error?: boolean }>`
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => (props.error ? props.theme.accentColor : "#b3b3b3")};
  margin-top: 47px;
  font-size: 18px;
`;

const ErrorView = styled.View`
  height: 25px;
`;

const Error = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  color: #e7564f;
  font-size: 12px;
  margin-top: 7px;
`;

const FieldContentOptionLine = styled.View`
  margin-top: 7px;
  justify-content: center;
  align-items: flex-end;
`;

const SkipButton = styled.TouchableOpacity``;

const SkipText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 12px;
  color: #8e8e8e;
`;

const SignUpPhone: React.FC<NativeStackScreenProps<SignUpStackParamList, "SignUpPhone">> = ({
  navigation: { navigate, setOptions, goBack },
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
    navigate("SignUpOrganization", { name, email, password, sex, birth, phone: phoneNumber });
  };

  const goToNext = () => {
    navigate("SignUpOrganization", { name, email, password, sex, birth, phone: undefined });
  };

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => goBack()}>
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
        <StatusBar translucent backgroundColor={"transparent"} barStyle={"dark-content"} />
        <BorderWrap>
          <Border />
        </BorderWrap>
        <Wrap>
          <AskText>연락처는 어떻게 되시나요?</AskText>
          <SubText>연락처는 ID 찾기에 사용됩니다.</SubText>
          <Input
            value={phoneNumber}
            keyboardType="numeric"
            placeholder="010-1234-1234"
            placeholderTextColor={"#B0B0B0"}
            maxLength={13}
            onChangeText={(phone: string) => setPhoneNumber(phone)}
            error={phoneNumber !== "" && !phoneReg.test(phoneNumber)}
          />
          <ErrorView>{phoneNumber !== "" && !phoneReg.test(phoneNumber) ? <Error>입력을 다시 한번 확인해주세요.</Error> : <></>}</ErrorView>
          {/* <FieldContentOptionLine>
            <SkipButton onPress={goToNext}>
              <SkipText>{`선택하지 않고 넘어가기 >`}</SkipText>
            </SkipButton>
          </FieldContentOptionLine> */}
        </Wrap>
        <BottomButton onPress={validate} disabled={!phoneReg.test(phoneNumber)} title={"다음"} />
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default SignUpPhone;
