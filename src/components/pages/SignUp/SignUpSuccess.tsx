import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { useMutation } from "react-query";
import { CommonApi, LoginRequest, LoginResponse } from "api";
import styled from "styled-components/native";
import { useToast } from "react-native-toast-notifications";
import { useAppDispatch } from "redux/store";
import { login } from "redux/slices/auth";
import { BackHandler, StatusBar, View } from "react-native";
import BottomButton from "@components/atoms/BottomButton";
import { SignUpStackParamList } from "@navigation/SignupStack";

const Container = styled.View`
  width: 100%;
  height: 100%;
`;

const Header = styled.View`
  padding-left: 20px;
  margin-top: 150px;
  margin-bottom: 120px;
`;

const LineView = styled.View`
  height: 1.5px;
  background-color: ${(props: any) => props.theme.infoColor};
`;

const HeaderTitle = styled.Text`
  font-family: ${(props: any) => props.theme.englishFontM};
  font-size: 40px;
  line-height: 43px;
`;

const HeaderText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 16px;
  color: ${(props: any) => props.theme.infoColor};
  margin-top: 10px;
`;

const Content = styled.View`
  flex-direction: row;
  padding-right: 30px;
`;

const ContentText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 16px;
`;

const SignUpSuccess: React.FC<NativeStackScreenProps<SignUpStackParamList, "SignUpSuccess">> = ({
  navigation,
  route: {
    params: { email, password },
  },
}) => {
  const dispatch = useAppDispatch();
  const toast = useToast();

  const mutation = useMutation<LoginResponse, any, LoginRequest>(CommonApi.login, {
    onSuccess: async (res) => {
      if (res.status === 200) {
        const token = res?.token;
        console.log(`Login: ${token}`);
        if (token) await dispatch(login({ token }));
      } else if (res.status === 400) {
        toast.show(`아이디와 비밀번호가 잘못되었습니다.`, { type: "warning" });
      } else if (res.status === 500) {
        toast.show(`알 수 없는 오류`, { type: "warning" });
      }
    },
    onError: (error) => {
      console.log(error);
      toast.show(`네트워크를 확인해주세요.`, { type: "warning" });
    },
  });

  const onSubmit = () => {
    const requestData: LoginRequest = { email, password };
    mutation.mutate(requestData);
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      navigation.navigate("LoginStack", { screen: "Login" });
      return true;
    });
    const unsubscribe = navigation.addListener("gestureEnd", () => {
      navigation.navigate("LoginStack", { screen: "Login" });
    });

    return () => {
      backHandler.remove();
      unsubscribe();
    };
  }, [navigation]);

  return (
    <Container>
      <StatusBar translucent backgroundColor={"transparent"} barStyle={"dark-content"} />
      <Header>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <HeaderTitle>{`Welcome to`}</HeaderTitle>
          <LineView style={{ width: "100%", marginLeft: 20, marginBottom: 3 }} />
        </View>
        <HeaderTitle>{`Onyou :)`}</HeaderTitle>
        <HeaderText>{`가입이 완료되었습니다.`}</HeaderText>
      </Header>
      <Content>
        <LineView style={{ flex: 1, marginRight: 20, marginTop: 10 }} />
        <ContentText>{`각종 모임을 통해\n공동체를 누려보세요!`}</ContentText>
      </Content>
      <BottomButton onPress={onSubmit} title={"로그인하기"} />
    </Container>
  );
};

export default SignUpSuccess;
