import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useLayoutEffect } from "react";
import { StatusBar, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Entypo } from "@expo/vector-icons";
import { useMutation } from "react-query";
import { UserApi, SignUpRequest } from "api";
import { useToast } from "react-native-toast-notifications";
import BottomButton from "@components/atoms/BottomButton";
import { SignUpStackParamList } from "@navigation/SignupStack";

const Container = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
`;

const Wrap = styled.View`
  width: 100%;
  padding: 0px 20px;
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
  margin-bottom: 15px;
`;

const Form = styled.View`
  width: 100%;
  margin-top: 25px;
`;

const TitleBorder = styled.View`
  width: 100%;
  padding-bottom: 5px;
  margin-bottom: 5px;
  border-bottom-width: 1px;
  border-bottom-color: #b3b3b3;
`;

const Title = styled.Text`
  color: #000000;
  font-size: 16px;
  font-weight: bold;
`;

const TextWrap = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 6px;
`;

const TextTitle = styled.Text`
  color: #838383;
  font-size: 14px;
`;

const TextInfo = styled.Text`
  color: #295af5;
  font-size: 14px;
`;

const SignUpConfirm: React.FC<NativeStackScreenProps<SignUpStackParamList, "SignUpConfirm">> = ({
  navigation: { navigate, setOptions, goBack },
  route: {
    params: { name, email, password, sex, birth, phone, organization },
  },
}) => {
  const toast = useToast();

  const mutation = useMutation(UserApi.registerUserInfo, {
    onSuccess: (res) => {
      if (res.status === 200) {
        navigate("SignUpSuccess", { email, password });
      } else if (res.status === 404) {
        toast.show("이미 가입된 사용자입니다.", { type: "warning" });
        navigate("LoginStack", { screen: "Login" });
      } else {
        console.log(`user register mutation success but please check status code`);
        toast.show(`회원가입에 실패했습니다. (Error Code: ${res.status})`, { type: "warning" });
      }
    },
    onError: (error) => {
      toast.show(`회원가입에 실패했습니다. (Error Code: ${error})`, { type: "warning" });
    },
  });

  const onSubmit = () => {
    const data = {
      name,
      email,
      password,
      sex: sex === "남성" ? "M" : "F",
      birthday: birth ?? null,
      phoneNumber: phone ?? null,
      organizationName: organization,
    };

    const requestData: SignUpRequest = data;
    mutation.mutate(requestData);
  };

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => goBack()}>
          <Entypo name="chevron-thin-left" size={20} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [name, email, password, sex, birth, phone, organization]);

  return (
    <Container>
      <StatusBar translucent backgroundColor={"transparent"} barStyle={"dark-content"} />
      <Wrap>
        <AskText>입력 정보가 모두 일치한가요?</AskText>
        <SubText>잘못 입력된 정보는 뒤로가기로 수정할 수 있습니다.</SubText>

        <Form>
          <TitleBorder>
            <Title>로그인 정보</Title>
          </TitleBorder>
          <TextWrap>
            <TextTitle>이름</TextTitle>
            <TextInfo>{name}</TextInfo>
          </TextWrap>
          <TextWrap>
            <TextTitle>이메일</TextTitle>
            <TextInfo>{email}</TextInfo>
          </TextWrap>
        </Form>
        <Form>
          <TitleBorder>
            <Title>기본 정보</Title>
          </TitleBorder>
          <TextWrap>
            <TextTitle>성별</TextTitle>
            <TextInfo>{sex}</TextInfo>
          </TextWrap>
          <TextWrap>
            <TextTitle>생년월일</TextTitle>
            <TextInfo>{birth}</TextInfo>
          </TextWrap>
          <TextWrap>
            <TextTitle>연락처</TextTitle>
            <TextInfo>{phone}</TextInfo>
          </TextWrap>
          <TextWrap>
            <TextTitle>소속 단체</TextTitle>
            <TextInfo>{organization}</TextInfo>
          </TextWrap>
        </Form>
      </Wrap>
      <BottomButton onPress={onSubmit} title={"일치합니다"} />
    </Container>
  );
};

export default SignUpConfirm;
