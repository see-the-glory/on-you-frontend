import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, createRef, useEffect } from "react";
import { Keyboard, StatusBar, TouchableWithoutFeedback } from "react-native";
import { useMutation } from "react-query";
import { UserApi, FindPwRequest } from "../../api";
import styled from "styled-components/native";
import { useToast } from "react-native-toast-notifications";
import CustomText from "../../components/CustomText";
import { FontAwesome } from "@expo/vector-icons";

const Container = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  padding-top: 30px;
`;

const Wrap = styled.View`
  width: 100%;
  padding: 0px 20px;
`;

const ButtonWrap = styled.View`
  width: 100%;
`;

const Form = styled.View`
  width: 100%;
  margin-bottom: 30px;
`;

const FormTitleView = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const IconWrap = styled.View`
  width: 20px;
  justify-content: center;
  align-items: center;
`;

const Title = styled(CustomText)`
  color: #1b1717;
  font-size: 16px;
  font-family: "NotoSansKR-Bold";
  line-height: 22px;
  padding-left: 5px;
`;

const Input = styled.TextInput`
  border-bottom-width: 0.5px;
  border-bottom-color: #000000;
  padding-bottom: 5px;
  font-size: 16px;
`;

const LoginButton = styled.TouchableOpacity<{ disabled: boolean }>`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 68px;
  padding-bottom: 8px;
  background-color: ${(props: any) => (props.disabled ? "#D3D3D3" : "#ff6534")};
`;

const LoginTitle = styled(CustomText)`
  font-family: "NotoSansKR-Bold";
  color: #fff;
  font-size: 20px;
  line-height: 24px;
`;

const FindPw: React.FC<NativeStackScreenProps<any, "Login">> = ({ navigation: { navigate } }) => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthNumber, setBirthNumber] = useState("");
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
        toast.show("일치하는 회원정보가 없습니다.", { type: "danger" });
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
        <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
        <Wrap>
          <Form>
            <FormTitleView>
              <IconWrap>
                <FontAwesome name="id-badge" size={17} color="black" />
              </IconWrap>
              <Title>이름</Title>
            </FormTitleView>
            <Input
              keyboardType={"name-phone-pad"}
              placeholder="홍길동"
              placeholderTextColor={"#B0B0B0"}
              maxLength={10}
              autoCorrect={false}
              onChangeText={(UserName: string) => setUserName(UserName)}
              clearButtonMode="always"
            />
          </Form>
          <Form>
            <FormTitleView>
              <IconWrap>
                <FontAwesome name="user-circle-o" size={15} color="black" />
              </IconWrap>
              <Title>이메일</Title>
            </FormTitleView>
            <Input placeholder="example@email.com" placeholderTextColor={"#B0B0B0"} autoCorrect={false} onChangeText={(email: string) => setUserEmail(email)} clearButtonMode="always" />
          </Form>
          <Form>
            <FormTitleView>
              <IconWrap>
                <FontAwesome name="mobile-phone" size={24} color="black" />
              </IconWrap>
              <Title>등록된 전화번호</Title>
            </FormTitleView>
            <Input
              placeholder="010-1234-1234"
              placeholderTextColor={"#B0B0B0"}
              keyboardType="numeric"
              maxLength={13}
              onChangeText={(phone: string) => setPhoneNumber(phone)}
              value={phoneNumber}
              clearButtonMode="always"
            />
          </Form>
          <Form>
            <FormTitleView>
              <IconWrap>
                <FontAwesome name="calendar-o" size={16} color="black" />
              </IconWrap>
              <Title>생년월일</Title>
            </FormTitleView>
            <Input
              placeholder="yyyy-mm-dd"
              placeholderTextColor={"#B0B0B0"}
              keyboardType="numeric"
              maxLength={10}
              onChangeText={(birth: string) => setBirthNumber(birth)}
              value={birthNumber}
              clearButtonMode="always"
            />
          </Form>
        </Wrap>
        <ButtonWrap>
          <LoginButton onPress={onSubmit}>
            <LoginTitle>확인</LoginTitle>
          </LoginButton>
        </ButtonWrap>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default FindPw;
