import { useMutation } from "react-query";
import { CommonApi, LoginRequest, LoginResponse } from "api";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Keyboard, Platform, SafeAreaView, StatusBar, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components/native";
import { useToast } from "react-native-toast-notifications";
import { useAppDispatch } from "redux/store";
import { login } from "redux/slices/auth";
import BottomButton from "@components/atoms/BottomButton";
import { LoginStackParamList } from "@navigation/LoginStack";
import { loginEvent } from "app/analytics";

const Container = styled.View`
  width: 100%;
  height: 100%;
  padding: 20px 20px 0px 20px;
`;

const Header = styled.View`
  margin-bottom: 30px;
`;

const HeaderTitle = styled.Text`
  font-family: ${(props: any) => props.theme.englishFontM};
  font-size: 40px;
`;

const Content = styled.View``;

const ContentTitle = styled.Text`
  font-family: ${(props: any) => props.theme.englishFontM};
  font-size: 16px;
  color: ${(props: any) => props.theme.infoColor};
  margin-bottom: 8px;
`;

const EmailView = styled.View`
  margin-bottom: 30px;
`;

const PasswordView = styled.View`
  margin-bottom: 10px;
`;

const ContentInput = styled.TextInput`
  font-family: ${(props: any) => props.theme.englishFontR};
  border-bottom-width: 0.5px;
  border-bottom-color: #000000;
  padding-bottom: 2px;
  font-size: 20px;
`;

const InformationView = styled.View`
  width: 100%;
  align-items: flex-end;
`;

const FindAccountButton = styled.TouchableOpacity``;

const InformationText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontSB};
  font-size: 14px;
  color: #777777;
`;

const Login: React.FC<NativeStackScreenProps<LoginStackParamList, "Login">> = ({ navigation: { navigate } }) => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();

  const mutation = useMutation<LoginResponse, any, LoginRequest>(CommonApi.login, {
    onSuccess: async (res) => {
      if (res.status === 200) {
        if (res.token) {
          loginEvent();
          await dispatch(login({ token: res.token }));
        }
      } else if (res.status === 400) {
        toast.show(`아이디와 비밀번호가 잘못되었습니다.`, { type: "danger" });
      } else if (res.status === 404) {
        toast.show(`존재하지 않는 아이디입니다.`, { type: "danger" });
      } else if (res.status === 500) {
        toast.show(`알 수 없는 오류`, { type: "danger" });
      }
    },
    onError: (error) => {
      console.log(error);
      toast.show(`네트워크를 확인해주세요.`, { type: "danger" });
    },
  });

  const goToFindLoginInfo = () => {
    navigate("LoginStack", { screen: "FindLoginInfo" });
  };

  const onSubmit = () => {
    const requestData: LoginRequest = {
      email: email.trim(),
      password,
    };

    mutation.mutate(requestData);
  };

  return (
    <SafeAreaView style={{ paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <Container>
          <StatusBar translucent backgroundColor={"transparent"} barStyle={"dark-content"} />
          <Header>
            <HeaderTitle>Log in</HeaderTitle>
          </Header>
          <Content>
            <EmailView>
              <ContentTitle>E-mail</ContentTitle>
              <ContentInput value={email} placeholder="example@email.com" placeholderTextColor={"#D0D0D0"} onChangeText={(text: string) => setEmail(text)} />
            </EmailView>
            <PasswordView>
              <ContentTitle>Password</ContentTitle>
              <ContentInput value={password} secureTextEntry={true} placeholder="비밀번호를 입력해주세요." placeholderTextColor={"#D0D0D0"} onChangeText={(text: string) => setPassword(text)} />
            </PasswordView>
            <InformationView>
              <FindAccountButton onPress={goToFindLoginInfo}>
                <InformationText>로그인 정보가 기억나지 않나요?</InformationText>
              </FindAccountButton>
            </InformationView>
          </Content>
        </Container>
      </TouchableWithoutFeedback>
      <BottomButton onPress={onSubmit} disabled={!(email.trim() && password)} title={"확인"} />
    </SafeAreaView>
  );
};

export default Login;
