import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { Keyboard, TouchableWithoutFeedback, TouchableOpacity, StatusBar } from "react-native";
import styled from "styled-components/native";
import { Entypo } from "@expo/vector-icons";
import BottomButton from "../../atoms/BottomButton";
import { SignUpStackParamList } from "../../../navigation/SignupStack";

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
  width: 60%;
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

const SignUpBirth: React.FC<NativeStackScreenProps<SignUpStackParamList, "SignUpBirth">> = ({
  navigation: { navigate, setOptions, goBack },
  route: {
    params: { name, email, password, sex },
  },
}) => {
  const [birthNumber, setBirthNumber] = useState("");

  const birthReg =
    /^(((?:(?:1[6-9]|[2-9]\d)?\d{2})(-)(?:(?:(?:0?[13578]|1[02])(-)31)|(?:(?:0?[1,3-9]|1[0-2])(-)(?:29|30))))|(((?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))(-)(?:0?2(-)29))|((?:(?:(?:1[6-9]|[2-9]\d)?\d{2})(-)(?:(?:0?[1-9])|(?:1[0-2]))(-)(?:0[1-9]|1\d|2[0-8]))))$/;

  useEffect(() => {
    if (birthNumber.length === 5) {
      setBirthNumber(birthNumber.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"));
    } else if (birthNumber.length === 6) {
      setBirthNumber(birthNumber.replace(/-/g, "").replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"));
    } else if (birthNumber.length === 7) {
      setBirthNumber(birthNumber.replace(/-/g, "").replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"));
    } else if (birthNumber.length === 8) {
      setBirthNumber(birthNumber.replace(/-/g, "").replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"));
    }
  }, [birthNumber]);

  const validate = () => {
    if (!birthReg.test(birthNumber)) {
      return;
    }
    navigate("SignUpPhone", { name, email, password, sex, birth: birthNumber });
  };

  const goToNext = () => {
    navigate("SignUpPhone", { name, email, password, sex, birth: undefined });
  };

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => goBack()}>
          <Entypo name="chevron-thin-left" size={20} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [name, email, password, sex]);

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
          <AskText>생년월일을 입력해주세요.</AskText>
          <SubText>정확한 생년월일을 입력해주세요.</SubText>
          <Input
            value={birthNumber}
            keyboardType="numeric"
            placeholder="yyyy-mm-dd"
            placeholderTextColor={"#B0B0B0"}
            maxLength={10}
            onChangeText={(birth: string) => setBirthNumber(birth)}
            error={birthNumber !== "" && !birthReg.test(birthNumber)}
          />
          <ErrorView>{birthNumber !== "" && !birthReg.test(birthNumber) ? <Error>입력을 다시 한번 확인해주세요.</Error> : <></>}</ErrorView>
          {/* <FieldContentOptionLine>
            <SkipButton onPress={goToNext}>
              <SkipText>{`선택하지 않고 넘어가기 >`}</SkipText>
            </SkipButton>
          </FieldContentOptionLine> */}
        </Wrap>
        <BottomButton onPress={validate} disabled={!birthReg.test(birthNumber)} title={"다음"} />
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default SignUpBirth;
