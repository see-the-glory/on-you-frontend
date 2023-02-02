import React, { useState, useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import styled from "styled-components/native";
import { TouchableOpacity, Text, Platform, KeyboardAvoidingView } from "react-native";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import CustomText from "../../components/CustomText";
import { useToast } from "react-native-toast-notifications";
import CustomTextInput from "../../components/CustomTextInput";
import { UserApi, PostChangePw } from "../../api";
import { RootState } from "../../redux/store/reducers";

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

const ChangePw: React.FC<NativeStackScreenProps<any, "ChangePw">> = ({ navigation: { navigate, setOptions } }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [pw, setPw] = useState<string>("");
  const toast = useToast();

  useEffect(() => {
    setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={onSubmit}>
          <Text style={{ color: "#2995FA" }}>저장</Text>
        </TouchableOpacity>
      ),
    });
  }, [pw]);

  const mutation = useMutation(UserApi.changePassword, {
    onSuccess: (res) => {
      if (res.status === 200) {
        toast.show(`비밀번호가 재설정되었습니다.`, {
          type: "success",
        });
        navigate("Tabs", {
          screen: "Profile",
        });
      } else {
        console.log(`changePassword mutation success but please check status code`);
        console.log(res);
        toast.show(`${res.error} (Error Code: ${res.status})`, {
          type: "warning",
        });
      }
    },
    onError: (error) => {
      console.log("--- Error ---");
      console.log(`error: ${error}`);
    },
  });

  const onSubmit = () => {
    const data = {
      password: pw,
    };

    const requestData: PostChangePw = { data, token };

    console.log(requestData);

    mutation.mutate(requestData);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100} style={{ flex: 1 }}>
        <Container>
          <Form>
            <Title>비밀번호 재설정</Title>
            <Input secureTextEntry={true} placeholderTextColor={"#B0B0B0"} autoCorrect={false} placeholder="재설정할 비밀번호를 입력해주세요." onChangeText={(pw: string) => setPw(pw)} />
          </Form>
        </Container>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default ChangePw;
