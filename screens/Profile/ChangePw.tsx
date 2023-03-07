import React, { useState, useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import styled from "styled-components/native";
import { TouchableOpacity, Text, Platform, KeyboardAvoidingView } from "react-native";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { useMutation } from "react-query";
import CustomText from "../../components/CustomText";
import { useToast } from "react-native-toast-notifications";
import CustomTextInput from "../../components/CustomTextInput";
import { UserApi, BaseResponse, ErrorResponse, PasswordChangeRequest } from "../../api";
import { Entypo } from "@expo/vector-icons";

const Container = styled.ScrollView`
  padding-left: 15px;
  padding-right: 15px;
`;

const Form = styled.View`
  margin-top: 40px;
  padding: 0 5px;
`;

const Title = styled(CustomText)`
  color: #b0b0b0;
  font-size: 10px;
  line-height: 15px;
  margin-bottom: 10px;
`;

const Input = styled(CustomTextInput)`
  font-size: 14px;
  line-height: 20px;
  border-bottom-width: 1px;
  border-bottom-color: #cecece;
  padding-bottom: 5px;
  color: black;
`;

const ChangePw: React.FC<NativeStackScreenProps<any, "ChangePw">> = ({ navigation: { navigate, setOptions, goBack } }) => {
  const [pw, setPw] = useState<string>("");
  const [pw2, setPw2] = useState<string>("");
  const toast = useToast();

  const numReg = /[0-9]+/;
  const engReg = /[a-zA-Z]+/;
  const specialReg = /[!@#$%^*+=-]+/;

  useEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => goBack()}>
          <Entypo name="chevron-thin-left" size={20} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={onSubmit}>
          <Text style={{ color: "#2995FA" }}>저장</Text>
        </TouchableOpacity>
      ),
    });
  }, [pw, pw2]);

  const mutation = useMutation<BaseResponse, ErrorResponse, PasswordChangeRequest>(UserApi.changePassword, {
    onSuccess: (res) => {
      toast.show(`비밀번호가 재설정되었습니다.`, { type: "success" });
      navigate("Tabs", {
        screen: "Profile",
      });
    },
    onError: (error) => {
      console.log(`API ERROR | getClubs ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const onSubmit = () => {
    const requestData: PasswordChangeRequest = {
      password: pw,
    };

    if (!numReg.test(pw) || !engReg.test(pw) || !specialReg.test(pw) || pw.length < 8 || pw !== pw2) {
      toast.show(`입력을 다시 확인해주세요.`, { type: "warning" });
    } else {
      mutation.mutate(requestData);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100} style={{ flex: 1 }}>
        <Container>
          <Form>
            <Title>비밀번호 재설정</Title>
            <Input
              clearButtonMode="always"
              secureTextEntry={true}
              placeholderTextColor={"#B0B0B0"}
              autoCorrect={false}
              placeholder="영문, 숫자, 특수문자 포함 8자 이상"
              onChangeText={(pw: string) => setPw(pw)}
            />
          </Form>
          <Form>
            <Title>비밀번호 확인</Title>
            <Input
              clearButtonMode="always"
              secureTextEntry={true}
              placeholderTextColor={"#B0B0B0"}
              autoCorrect={false}
              placeholder="재설정 비밀번호를 한번 더 입력해주세요."
              onChangeText={(pw: string) => setPw2(pw)}
            />
          </Form>
        </Container>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default ChangePw;
