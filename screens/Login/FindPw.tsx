import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, createRef, useEffect } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { useMutation, useQuery } from "react-query";
import { UserApi, FindPwRequest } from "../../api";
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

const FindPw: React.FC<NativeStackScreenProps<any, "Login">> = ({ navigation: { navigate } }) => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthNumber, setBirthNumber] = useState("");
  const nameInputRef = createRef();
  const emailInputRef = createRef();
  const phoneInputRef = createRef();
  const birthInputRef = createRef();
  const [errortext, setErrortext] = useState(false);
  const nameReg = /^[가-힣]+$/;
  const phoneReg = /^(01[0|1|6|7|8|9]?)-([0-9]{4})-([0-9]{4})$/;
  const birthReg = /^(19[0-9][0-9]|20\d{2})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;

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

  useEffect(() => {
    if (birthNumber.length === 5) {
      setBirthNumber(birthNumber.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"));
    } else if (birthNumber.length === 6) {
      setBirthNumber(birthNumber.replace(/-/g, "").replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"));
    } else if (birthNumber.length === 7) {
      setBirthNumber(birthNumber.replace(/-/g, "").replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"));
    } else if (birthNumber.length === 8) {
      setBirthNumber(birthNumber.replace(/-/g, "").replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"));
    }
  }, [birthNumber]);

  const mutation = useMutation(UserApi.FindUserPw, {
    onSuccess: (res) => {
      if (res.status === 200 && res.resultCode === "OK") {
        console.log(`success`);
        console.log(res.data);
        navigate("LoginStack", {
          screen: "FindPwResult",
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
      birthday: birthNumber,
      email: userEmail,
      phoneNumber: phoneNumber,
      username: userName,
    };

    const requestData: FindPwRequest = data;

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
          <Title>이메일</Title>
          <Input
            placeholder="example@email.com"
            placeholderTextColor={"#B0B0B0"}
            autoCorrect={false}
            onChangeText={(email) => setUserEmail(email)}
            ref={emailInputRef}
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
        <Form>
          <Title>생년월일</Title>
          <Input
            placeholder="yyyy-MM-dd"
            placeholderTextColor={"#B0B0B0"}
            keyboardType="numeric"
            maxLength={10}
            onChangeText={(birth) => setBirthNumber(birth)}
            value={birthNumber}
            ref={birthInputRef}
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

export default FindPw;
