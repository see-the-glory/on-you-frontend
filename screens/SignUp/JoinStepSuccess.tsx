import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { useMutation } from "react-query";
import { CommonApi, LoginRequest, LoginResponse } from "../../api";
import styled from "styled-components/native";
import { useToast } from "react-native-toast-notifications";
import { useAppDispatch } from "../../redux/store";
import { login } from "../../redux/slices/auth";
import CustomText from "../../components/CustomText";
import { BackHandler, StatusBar } from "react-native";
import { Feather } from "@expo/vector-icons";
import BottomButton from "../../components/BottomButton";

const Container = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-between;
`;

const Wrap = styled.View`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  padding-bottom: 68px;
`;

const AskText = styled.Text`
  color: #000000;
  font-size: 20px;
  font-weight: bold;
`;

const SubText = styled.Text`
  color: #a0a0a0;
  font-size: 13px;
  margin-top: 7px;
`;

const JoinStepSuccess: React.FC<NativeStackScreenProps<any, "JoinStepSuccess">> = ({
  navigation,
  route: {
    params: { email, password, token },
  },
}) => {
  const dispatch = useAppDispatch();
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

  const onSubmit = () => {
    const requestData: LoginRequest = {
      email,
      password,
    };

    mutation.mutate(requestData);
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      navigation.navigate("LoginStack", {
        screen: "Login",
      });
      return true;
    });
    const unsubscribe = navigation.addListener("gestureEnd", () => {
      navigation.navigate("LoginStack", {
        screen: "Login",
      });
    });

    return () => {
      backHandler.remove();
      unsubscribe();
    };
  }, [navigation]);

  return (
    <Container>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <Wrap>
        <Feather name="check" size={58} color="#CCCCCC" />
        <AskText>가입이 완료되었습니다.</AskText>
        <SubText>온유에 오신 것을 환영합니다 :&#41;</SubText>
      </Wrap>
      <BottomButton onPress={onSubmit} title={"시작하기"} />
    </Container>
  );
};

export default JoinStepSuccess;
