import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import { Keyboard, StatusBar, TouchableWithoutFeedback } from "react-native";
import { useMutation } from "react-query";
import { FindPasswordRequest, UserApi } from "api";
import styled from "styled-components/native";
import { useToast } from "react-native-toast-notifications";
import BottomButton from "@components/atoms/BottomButton";
import { LoginStackParamList } from "@navigation/LoginStack";

const Container = styled.View`
  width: 100%;
  height: 100%;
  padding: 20px;
`;

const Content = styled.View``;

const ContentTitle = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontSB};
  font-size: 16px;
  color: ${(props: any) => props.theme.infoColor};
  margin-bottom: 8px;
`;

const ItemView = styled.View`
  margin-bottom: 30px;
`;

const ContentInput = styled.TextInput`
  font-family: ${(props: any) => props.theme.koreanFontR};
  border-bottom-width: 0.5px;
  border-bottom-color: #000000;
  padding-bottom: 2px;
  font-size: 20px;
`;

const FindPassword: React.FC<NativeStackScreenProps<LoginStackParamList, "FindPassword">> = ({ navigation: { navigate } }) => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthNumber, setBirthNumber] = useState("");
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
      if (res.status === 200) {
      } else if (res.status === 500) {
        console.log(res);
        toast.show(`알 수 없는 오류`, { type: "danger" });
      } else {
        toast.show(`${res?.message}`, { type: "warning" });
      }
    },
    onError: (error) => {
      console.log(error);
      toast.show(`네트워크를 확인해주세요.`, { type: "danger" });
    },
    onSettled: (res, error) => {},
  });

  const onSubmit = () => {
    const data = {
      birthday: birthNumber,
      email: userEmail,
      phoneNumber: phoneNumber,
      username: userName.trim(),
    };

    const requestData: FindPasswordRequest = data;
    mutation.mutate(requestData);
    navigate("FindResult", { findType: "Password" });
  };

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <Container>
          <StatusBar translucent backgroundColor={"transparent"} barStyle={"dark-content"} />
          <Content>
            <ItemView>
              <ContentTitle>이름</ContentTitle>
              <ContentInput
                value={userName}
                placeholder="홍길동"
                maxLength={10}
                placeholderTextColor={"#D0D0D0"}
                onChangeText={(text: string) => setUserName(text)}
                onEndEditing={() => setUserName((prev) => prev.trim())}
              />
            </ItemView>
            <ItemView>
              <ContentTitle>이메일</ContentTitle>
              <ContentInput
                value={userEmail}
                placeholder="example@email.com"
                placeholderTextColor={"#D0D0D0"}
                onChangeText={(text: string) => setUserEmail(text)}
                onEndEditing={() => setUserEmail((prev) => prev.trim())}
              />
            </ItemView>
            <ItemView>
              <ContentTitle>등록된 전화번호</ContentTitle>
              <ContentInput
                value={phoneNumber}
                placeholder="010-1234-1234"
                keyboardType="numeric"
                maxLength={13}
                placeholderTextColor={"#D0D0D0"}
                onChangeText={(text: string) => setPhoneNumber(text)}
                onEndEditing={() => setPhoneNumber((prev) => prev.trim())}
              />
            </ItemView>
            <ItemView>
              <ContentTitle>생년월일</ContentTitle>
              <ContentInput
                value={birthNumber}
                placeholder="yyyy-mm-dd"
                maxLength={10}
                placeholderTextColor={"#D0D0D0"}
                onChangeText={(text: string) => setBirthNumber(text)}
                onEndEditing={() => setBirthNumber((prev) => prev.trim())}
              />
            </ItemView>
          </Content>
        </Container>
      </TouchableWithoutFeedback>
      <BottomButton onPress={onSubmit} disabled={!(userName.trim() && phoneNumber.trim() && userEmail.trim() && birthNumber.trim())} title={"확인"} />
    </>
  );
};

export default FindPassword;
