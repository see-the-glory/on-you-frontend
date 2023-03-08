import { useMutation } from "react-query";
import { CommonApi, LoginRequest, LoginResponse } from "../../api";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Keyboard, StatusBar, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components/native";
import CustomText from "../../components/CustomText";
import { useToast } from "react-native-toast-notifications";
import { useAppDispatch } from "../../redux/store";
import { login } from "../../redux/slices/auth";
import { FontAwesome } from "@expo/vector-icons";

const Container = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  padding-top: 30px;
`;

const Wrap = styled.View`
  width: 100%;
  padding: 0px 20px;
`;

const ButtonWrap = styled.View`
  width: 100%;
`;

const Form = styled.View`
  width: 100%;
  margin-bottom: 30px;
`;

const FormTitleView = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const IconWrap = styled.View`
  width: 20px;
  justify-content: center;
  align-items: center;
`;

const Title = styled(CustomText)`
  color: #1b1717;
  font-size: 16px;
  font-family: "NotoSansKR-Bold";
  line-height: 22px;
  padding-left: 5px;
`;

const Input = styled.TextInput`
  border-bottom-width: 0.5px;
  border-bottom-color: #000000;
  padding-bottom: 5px;
  font-size: 16px;
`;

const ForgetView = styled.TouchableOpacity`
  width: 100%;
  margin-top: 15px;
  padding: 0;
  /* border-bottom-width: 1px;
  border-bottom-color: #6f6f6f; */
`;

const ForgetText = styled(CustomText)`
  width: 100%;
  color: #6f6f6f;
  font-size: 12px;
  line-height: 16px;
  text-decoration: underline;
`;

const LoginButton = styled.TouchableOpacity<{ disabled: boolean }>`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 68px;
  padding-bottom: 8px;
  background-color: ${(props: any) => (props.disabled ? "#D3D3D3" : "#ff6534")};
`;

const LoginTitle = styled(CustomText)`
  font-family: "NotoSansKR-Bold";
  color: #fff;
  font-size: 20px;
  line-height: 24px;
`;

const Login: React.FC<NativeStackScreenProps<any, "Login">> = ({ navigation: { navigate } }) => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();

  const mutation = useMutation<LoginResponse, any, LoginRequest>(CommonApi.login, {
    onSuccess: async (res) => {
      if (res.status === 200) {
        const token = res.token;
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

  const goToFindLoginInfo = () => {
    navigate("LoginStack", {
      screen: "FindLoginInfo",
    });
  };

  const onSubmit = () => {
    const requestData: LoginRequest = {
      email: email.trim(),
      password,
    };

    mutation.mutate(requestData);
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <Container>
        <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
        <Wrap>
          <Form>
            <FormTitleView>
              <IconWrap>
                <FontAwesome name="user-circle-o" size={15} color="black" />
              </IconWrap>
              <Title>아이디</Title>
            </FormTitleView>
            <Input placeholder="example@email.com" placeholderTextColor={"#B0B0B0"} onChangeText={(text: string) => setEmail(text)} />
          </Form>
          <Form>
            <FormTitleView>
              <IconWrap>
                <FontAwesome name="lock" size={17} color="black" />
              </IconWrap>
              <Title>비밀번호</Title>
            </FormTitleView>
            <Input secureTextEntry={true} placeholder="비밀번호를 입력해주세요." placeholderTextColor={"#B0B0B0"} onChangeText={(text: string) => setPassword(text)} />
            <ForgetView onPress={goToFindLoginInfo}>
              <ForgetText>로그인 정보가 기억나지 않을때</ForgetText>
            </ForgetView>
          </Form>
        </Wrap>
        <ButtonWrap>
          <LoginButton onPress={onSubmit} disabled={!(email.trim() && password)}>
            <LoginTitle>로그인</LoginTitle>
          </LoginButton>
        </ButtonWrap>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default Login;
