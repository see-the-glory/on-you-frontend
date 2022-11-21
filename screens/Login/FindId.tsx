import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, createRef, useEffect } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { useMutation, useQuery } from "react-query";
import { UserApi, FindIdRequest } from "../../api";
import styled from "styled-components/native";
import { useToast } from "react-native-toast-notifications";

const Container = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
  padding-horizontal: 20px;
  padding-top: 30px;
`;

const Form = styled.View`
  width: 100%;
  margin-top: 35px;
`;

const Title = styled.Text`
  color: #1b1717;
  font-size: 16px;
  margin-bottom: 8px;
`;

const Input = styled.TextInput`
  border-bottom-width: 1px;
  border-bottom-color: #000000;
  padding-bottom: 5px;
  font-size: 18px;
`;

const Button = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 48px;
  background-color: #ff714b;
  margin-top: 10%;
`;

const ButtonTitle = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: 700;
`;

const FindId: React.FC<NativeStackScreenProps<any, "Login">> = ({ navigation: { navigate } }) => {
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const phoneInputRef = createRef();
  const [errortext, setErrortext] = useState(false);
  const nameInputRef = createRef();
  const nameReg = /^[가-힣]+$/;
  const phoneReg = /^(01[0|1|6|7|8|9]?)-([0-9]{4})-([0-9]{4})$/;

  const toast = useToast();

  useEffect(() => {
    if (phoneNumber.length === 10) {
      setPhoneNumber(phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3"));
    } else if (phoneNumber.length === 11) {
      setPhoneNumber(phoneNumber.replace(/-/g, "").replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3"));
    } else if (phoneNumber.length === 12) {
      setPhoneNumber(phoneNumber.replace(/-/g, "").replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3"));
    } else if (phoneNumber.length === 13) {
      setPhoneNumber(phoneNumber.replace(/-/g, "").replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3"));
    }
  }, [phoneNumber]);

  const mutation = useMutation(UserApi.FindUserId, {
    onSuccess: (res) => {
      if (res.status === 200 && res.resultCode === "OK") {
        console.log(`success`);
        console.log(res.data);
        navigate("LoginStack", {
          screen: "FindIdResult",
          email: res.data,
        });
      } else {
        console.log(`mutation success but please check status code`);
        console.log(res);
        toast.show("일치하는 회원정보가 없습니다.", {
          type: "warning",
        });
      }
    },
    onError: (error) => {
      console.log("--- Error ---");
      console.log(`error: ${error}`);
    },
    onSettled: (res, error) => {},
  });

  const onSubmit = () => {
    const data = {
      phoneNumber: phoneNumber,
      username: userName,
    };

    const requestData: FindIdRequest = data;

    mutation.mutate(requestData);
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <Container>
        <Form>
          <Title>이름</Title>
          <Input
            keyboardType={"name-phone-pad"}
            placeholder="홍길동"
            placeholderTextColor={"#B0B0B0"}
            maxLength={10}
            autoCorrect={false}
            onChangeText={(UserName) => setUserName(UserName)}
            ref={nameInputRef}
            returnKeyType="next"
            blurOnSubmit={false}
          />
        </Form>
        <Form>
          <Title>등록된 전화번호</Title>
          <Input
            placeholder="010-1234-1234"
            placeholderTextColor={"#B0B0B0"}
            keyboardType="numeric"
            maxLength={13}
            onChangeText={(phone) => setPhoneNumber(phone)}
            value={phoneNumber}
            ref={phoneInputRef}
            returnKeyType="next"
            blurOnSubmit={false}
          />
        </Form>
        <Button onPress={onSubmit}>
          <ButtonTitle>확인</ButtonTitle>
        </Button>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default FindId;
