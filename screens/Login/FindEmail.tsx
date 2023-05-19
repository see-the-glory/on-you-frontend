import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import { Keyboard, StatusBar, TouchableWithoutFeedback } from "react-native";
import { useMutation } from "react-query";
import { UserApi, FindEmailRequest } from "../../api";
import styled from "styled-components/native";
import { useToast } from "react-native-toast-notifications";
import BottomButton from "../../components/BottomButton";

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

const NameView = styled.View`
  margin-bottom: 30px;
`;

const PhoneNumberView = styled.View`
  margin-bottom: 10px;
`;

const ContentInput = styled.TextInput`
  font-family: ${(props: any) => props.theme.koreanFontR};
  border-bottom-width: 0.5px;
  border-bottom-color: #000000;
  padding-bottom: 2px;
  font-size: 20px;
`;

const FindEmail: React.FC<NativeStackScreenProps<any, "FindEmail">> = ({ navigation: { navigate } }) => {
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
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
      console.log(res);
      if (res.status === 200) {
        navigate("FindResult", { findType: "Email", email: res?.data });
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
  });

  const onSubmit = () => {
    const data = {
      phoneNumber: phoneNumber,
      username: userName,
    };
    const requestData: FindEmailRequest = data;
    mutation.mutate(requestData);
  };

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <Container>
          <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
          <Content>
            <NameView>
              <ContentTitle>이름</ContentTitle>
              <ContentInput
                value={userName}
                placeholder="홍길동"
                maxLength={10}
                placeholderTextColor={"#D0D0D0"}
                onChangeText={(text: string) => setUserName(text)}
                onEndEditing={() => setUserName((prev) => prev.trim())}
              />
            </NameView>
            <PhoneNumberView>
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
            </PhoneNumberView>
          </Content>
        </Container>
      </TouchableWithoutFeedback>
      <BottomButton onPress={onSubmit} disabled={!(userName.trim() && phoneNumber.trim())} title={"확인"} />
    </>
  );
};

export default FindEmail;
