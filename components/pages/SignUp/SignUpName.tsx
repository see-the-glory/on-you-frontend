import { AntDesign } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Keyboard, StatusBar, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components/native";
import { SignUpStackParamList } from "../../../navigation/SignupStack";
import BottomButton from "../../atoms/BottomButton";

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
  width: 10%;
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
  font-family: ${(props: any) => props.theme.koreanFontR};
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => (props.error ? props.theme.accentColor : "#b3b3b3")};
  margin-top: 47px;
  font-size: 18px;
`;

const Error = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  color: #e7564f;
  font-size: 12px;
`;

const ValidationView = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 7px;
`;

const SignUpName: React.FC<NativeStackScreenProps<SignUpStackParamList, "SignUpName">> = ({ navigation: { navigate } }) => {
  const [userName, setUserName] = useState("");
  const [error, setError] = useState<boolean>(false);

  const nameReg = /^[가-힣]+$/;

  const goToNext = () => {
    if (!nameReg.test(userName)) {
      return;
    }
    navigate("SignUpStack", { screen: "SignUpEmail", params: { name: userName } });
  };

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
          <AskText>성함이 어떻게 되시나요?</AskText>
          <SubText>정확한 성함을 입력해 주세요.</SubText>
          <Input
            keyboardType={"name-phone-pad"}
            placeholder="홍길동"
            maxLength={10}
            autoCorrect={false}
            onChangeText={(name: string) => setUserName(name)}
            placeholderTextColor={"#B0B0B0"}
            error={userName !== "" && !nameReg.test(userName)}
          />
          {userName !== "" && !nameReg.test(userName) ? (
            <ValidationView>
              <AntDesign name="exclamationcircleo" size={12} color="#E7564F" />
              <Error>{` 입력을 다시 한번 확인해주세요.`}</Error>
            </ValidationView>
          ) : (
            <></>
          )}
        </Wrap>
        <BottomButton onPress={goToNext} disabled={!nameReg.test(userName)} title={"다음"} />
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default SignUpName;
