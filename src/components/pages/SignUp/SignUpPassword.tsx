import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, useLayoutEffect } from "react";
import { TouchableOpacity, StatusBar, ScrollView, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import BottomButton from "@components/atoms/BottomButton";
import { lightTheme } from "app/theme";
import { SignUpStackParamList } from "@navigation/SignupStack";

const Container = styled.View`
  flex: 1;
`;

const Wrap = styled.View`
  width: 100%;
  padding: 0px 20px;
`;

const Item = styled.View`
  margin-top: 24px;
`;

const BorderWrap = styled.View`
  width: 100%;
  height: 2px;
  background-color: #d0d0d0;
`;

const Border = styled.View`
  width: 30%;
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

const Input = styled.TextInput`
  border-bottom-width: 1px;
  border-bottom-color: #b3b3b3;
  margin-top: 35px;
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
  margin-bottom: 80px;
`;
const ValidationItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 8px;
`;

const ValidationText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  color: #8e8e8e;
  font-size: 12px;
`;

const SignUpPassword: React.FC<NativeStackScreenProps<SignUpStackParamList, "SignUpPassword">> = ({
  navigation: { navigate, setOptions, goBack },
  route: {
    params: { name, email },
  },
}) => {
  const [password, setPassword] = useState<string>("");
  const [checkPassword, setCheckPassword] = useState<string>("");
  const { height: SCREEN_HEIGHT } = useWindowDimensions();

  const numReg = /[0-9]+/;
  const engReg = /[a-zA-Z]+/;
  const specialReg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]+/;

  const validate = () => {
    if (!numReg.test(password) || !engReg.test(password) || !specialReg.test(password) || password.length < 8 || password !== checkPassword) {
      return;
    }
    navigate("SignUpSex", { name, email, password });
  };

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => goBack()}>
          <Entypo name="chevron-thin-left" size={20} color="black" />
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <Container>
      <StatusBar translucent backgroundColor={"transparent"} barStyle={"dark-content"} />
      <ScrollView contentContainerStyle={{ minHeight: SCREEN_HEIGHT - 100 }} stickyHeaderIndices={[0]} showsVerticalScrollIndicator={false}>
        <BorderWrap>
          <Border />
        </BorderWrap>
        <Wrap>
          <Item>
            <AskText>비밀번호를 설정해주세요.</AskText>
            <SubText>로그인 정보로 활용됩니다.</SubText>
            <Input placeholder="영문, 숫자, 특수문자 포함 8자 이상" placeholderTextColor={"#B0B0B0"} secureTextEntry={true} autoCorrect={false} onChangeText={(value: string) => setPassword(value)} />

            <ValidationView>
              <ValidationItem>
                <AntDesign name="check" size={12} color={engReg.test(password) ? "#295AF5" : "#8e8e8e"} />
                <ValidationText>{` 영문 포함`}</ValidationText>
              </ValidationItem>
              <ValidationItem>
                <AntDesign name="check" size={12} color={numReg.test(password) ? "#295AF5" : "#8e8e8e"} />
                <ValidationText>{` 숫자 포함`}</ValidationText>
              </ValidationItem>
              <ValidationItem>
                <AntDesign name="check" size={12} color={specialReg.test(password) ? "#295AF5" : "#8e8e8e"} />
                <ValidationText>{` 특수문자 포함`}</ValidationText>
              </ValidationItem>
              <ValidationItem>
                <AntDesign name="check" size={12} color={password.length > 7 ? "#295AF5" : "#8e8e8e"} />
                <ValidationText>{` 8자리 이상`}</ValidationText>
              </ValidationItem>
            </ValidationView>
          </Item>
          <AskText>비밀번호를 다시 입력해주세요.</AskText>
          <Input
            placeholder="영문, 숫자, 특수문자 포함 8자 이상"
            placeholderTextColor={"#B0B0B0"}
            secureTextEntry={true}
            autoCorrect={false}
            onChangeText={(value: string) => setCheckPassword(value)}
          />
          {password !== checkPassword && password !== "" && checkPassword !== "" ? (
            <ValidationView>
              <AntDesign name="exclamationcircleo" size={12} color={lightTheme.accentColor} />
              <Error>{` 입력을 다시 한번 확인해주세요.`}</Error>
            </ValidationView>
          ) : (
            <></>
          )}
        </Wrap>
      </ScrollView>
      <BottomButton onPress={validate} disabled={!numReg.test(password) || !engReg.test(password) || !specialReg.test(password) || password.length < 8 || password !== checkPassword} title={"다음"} />
    </Container>
  );
};

export default SignUpPassword;
