import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { CommonApi, LoginRequest, UserApi, UserInfoResponse } from "../../api";
import { useDispatch } from "react-redux";
import { login, updateUser } from "../../store/Actions";
import styled from "styled-components/native";
import { useToast } from "react-native-toast-notifications";

const Container = styled.View`
  width: 100%;
  height: 95%;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding-horizontal: 20px;
  padding-top: 30px;
`;

const Wrap = styled.View`
  width: 100%;
`;

const BorderWrap = styled.View`
  width: 100%;
  height: 2px;
  background-color: #d0d0d0;
`;

const Border = styled.View`
  width: 100%;
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
  height: 48px;
  background-color: ${(props) => (props.disabled ? "#d3d3d3" : "#295AF5")};
`;

const ButtonTitle = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: 700;
`;

const Error = styled.Text`
  color: #ff714b;
  font-size: 12px;
  margin-top: 7px;
  margin-bottom: 20px;
`;

const JoinStepSuccess: React.FC<NativeStackScreenProps<any, "AuthStack">> = ({
  navigation: { navigate },
  route: {
    params: { email, password },
  },
}) => {
  const dispatch = useDispatch();
  const [token, setToken] = useState<string>("");
  const toast = useToast();
  useQuery<UserInfoResponse>(["getUserInfo", token], UserApi.getUserInfo, {
    onSuccess: (res) => {
      if (res.status === 200 && res.resultCode === "OK") {
        dispatch(updateUser(res.data));
        dispatch(login(token));
      } else {
        console.log(res);
        toast.show(`유저 정보를 불러올 수 없습니다.`, {
          type: "warning",
        });
      }
    },
    onError: (error) => {
      console.log(error);
    },
    enabled: token ? true : false,
  });

  const mutation = useMutation(CommonApi.getJWT, {
    onSuccess: (res) => {
      console.log(res.status);
      setToken(res.token);
    },
    onError: (error) => {
      console.log("--- Error ---");
      console.log(error);
      // Toast Message 출력.
    },
  });

  const onSubmit = () => {
    const token = {
      email,
      password,
    };

    const requestData: LoginRequest = token;

    console.log(requestData);

    mutation.mutate(requestData);
  };

  const goToNext = () => {
    navigate("LoginStack", {
      screen: "Login",
    });
  };

  return (
    <Container>
      <Wrap>
        <BorderWrap>
          <Border></Border>
        </BorderWrap>
        <AskText>가입이 완료되었습니다.</AskText>
        <SubText>온유에 오신 것을 환영합니다 :&#41;</SubText>
      </Wrap>
      <Wrap>
        <Button onPress={onSubmit}>
          <ButtonTitle>시작하기</ButtonTitle>
        </Button>
      </Wrap>
    </Container>
  );
};

export default JoinStepSuccess;
