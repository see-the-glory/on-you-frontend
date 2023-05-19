import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, useLayoutEffect } from "react";
import { Keyboard, TouchableWithoutFeedback, TouchableOpacity, StatusBar, Text, ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import CustomText from "../../components/CustomText";
import { useMutation } from "react-query";
import { CommonApi, DuplicateCheckResponse, EmailCheckRequest, EmailValidRequest, SendCheckEmailResponse, ValidCheckEmailResponse } from "../../api";
import { useToast } from "react-native-toast-notifications";
import BottomButton from "../../components/BottomButton";
import { lightTheme } from "../../theme";

const Container = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
`;

const Wrap = styled.View`
  width: 100%;
  padding: 0px 20px;
`;

const Header = styled.View`
  margin-bottom: 47px;
`;

const Item = styled.View<{ error: boolean }>`
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => (props.error ? props.theme.accentColor : "#b3b3b3")};
  margin-bottom: ${(props: any) => (props.error ? 0 : 43)}px;
`;

const ItemInputView = styled.View`
  flex-direction: row;
  align-items: center;
`;

const BorderWrap = styled.View`
  width: 100%;
  height: 2px;
  background-color: #d0d0d0;
`;

const Border = styled.View`
  width: 20%;
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

const ItemText = styled.Text`
  font-family: ${(props: any) => props.theme.englishFontR};
  color: #a0a0a0;
  font-size: 13px;
  margin-bottom: 3px;
`;

const Input = styled.TextInput<{ error: boolean }>`
  font-family: ${(props: any) => props.theme.englishFontR};
  font-size: 18px;
`;

const Error = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  color: #e7564f;
  font-size: 12px;
`;

const ValidButton = styled.TouchableOpacity``;
const ValidText = styled.Text<{ error: boolean }>`
  opacity: ${(props: any) => (props.error ? 0.2 : 1)};
`;

const ValidationView = styled.View<{ error: boolean }>`
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
  margin-bottom: ${(props: any) => (props.error ? 20 : 0)}px;
`;

const SignUpEmail: React.FC<NativeStackScreenProps<any, "SignUpEmail">> = ({
  navigation: { navigate, setOptions, goBack },
  route: {
    params: { name },
  },
}) => {
  const toast = useToast();
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const emailReg = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

  const codeCheckMutation = useMutation<ValidCheckEmailResponse, any, EmailValidRequest>(CommonApi.validCheckEmail);
  const emailDupMutation = useMutation<DuplicateCheckResponse, any, EmailCheckRequest>(CommonApi.duplicateEmailCheck, {
    onSuccess: (res) => {
      if (res.status === 200) {
        if (res.data?.isDuplicated === "Y") {
          toast.show(`이미 가입된 이메일입니다.`, { type: "warning" });
        } else {
          emailAuthMutation.mutate({ email });
        }
      } else if (res.status === 400) {
        toast.show(`잘못된 이메일 형식입니다.`, { type: "warning" });
      } else if (res.status === 500) {
        toast.show(`알 수 없는 오류`, { type: "danger" });
      }
    },
    onError: (error) => {
      console.log(error);
      toast.show(`네트워크를 확인해주세요.`, { type: "danger" });
    },
  });
  const emailAuthMutation = useMutation<SendCheckEmailResponse, any, EmailCheckRequest>(CommonApi.sendCheckEmail, {
    onSuccess: (res) => {
      if (res.status === 200) {
        toast.show(`인증코드를 발송했습니다.`, { type: "success" });
      } else if (res.status === 400) {
        toast.show(`잘못된 이메일 형식입니다.`, { type: "warning" });
      } else if (res.status === 500) {
        toast.show(`알 수 없는 오류`, { type: "danger" });
      }
    },
    onError: (error) => {
      console.log(error);
      toast.show(`네트워크를 확인해주세요.`, { type: "danger" });
    },
  });

  const authEmail = () => {
    if (!emailReg.test(email)) return toast.show(`이메일이 잘못되었습니다.`, { type: "warning" });
    emailDupMutation.mutate({ email });
  };

  const goToNext = () => {
    if (!emailReg.test(email)) return toast.show(`이메일이 잘못되었습니다.`, { type: "warning" });
    if (code.length === 0) return toast.show(`인증코드를 입력하세요.`, { type: "warning" });

    const requestData: EmailValidRequest = {
      email,
      checkString: code,
    };
    codeCheckMutation.mutate(requestData, {
      onSuccess: (res) => {
        if (res.status === 200) {
          navigate("SignUpStack", {
            screen: "SignUpPassword",
            params: {
              name,
              email,
            },
          });
        } else if (res.status === 400) {
          toast.show(`인증코드가 잘못되었습니다.`, { type: "warning" });
        } else if (res.status === 404) {
          toast.show(`${res.message}`, { type: "danger" });
        } else if (res.status === 500) {
          toast.show(`알 수 없는 오류`, { type: "danger" });
        }
      },
      onError: (error) => {
        console.log(error);
        toast.show(`네트워크를 확인해주세요.`, { type: "danger" });
      },
    });
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
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <Container>
        <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
        <BorderWrap>
          <Border />
        </BorderWrap>
        <Wrap>
          <Header>
            <AskText>이메일을 적어주세요.</AskText>
            <SubText>로그인 ID로 활용됩니다.</SubText>
          </Header>
          <ItemText>Email</ItemText>
          <Item error={email !== "" && !emailReg.test(email)}>
            <ItemInputView>
              <Input style={{ flex: 1 }} value={email} placeholder="example@email.com" placeholderTextColor={"#B0B0B0"} autoCorrect={false} onChangeText={(email: string) => setEmail(email)} />
              {emailAuthMutation.isLoading ? (
                <ActivityIndicator />
              ) : (
                <ValidButton disabled={!emailReg.test(email) || emailDupMutation.isLoading || emailAuthMutation.isLoading} onPress={authEmail}>
                  <ValidText error={!emailReg.test(email)}>인증하기</ValidText>
                </ValidButton>
              )}
            </ItemInputView>
          </Item>
          {email !== "" && !emailReg.test(email) ? (
            <ValidationView error={email !== "" && !emailReg.test(email)}>
              <AntDesign name="exclamationcircleo" size={12} color={lightTheme.accentColor} />
              <Error>{` 입력을 다시 한번 확인해주세요.`}</Error>
            </ValidationView>
          ) : (
            <></>
          )}
          <ItemText>Code</ItemText>
          <Item>
            <Input value={code} placeholder="인증코드" placeholderTextColor={"#B0B0B0"} autoCorrect={false} onChangeText={(code: string) => setCode(code)} />
          </Item>
        </Wrap>
        <BottomButton onPress={goToNext} disabled={email.length === 0 || code.length === 0 || !emailReg.test(email)} title={"다음"} />
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default SignUpEmail;
