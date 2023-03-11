import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import { Keyboard, StatusBar, TouchableWithoutFeedback } from "react-native";
import { useMutation } from "react-query";
import { UserApi, FindIdRequest } from "../../api";
import styled from "styled-components/native";
import { useToast } from "react-native-toast-notifications";
import CustomText from "../../components/CustomText";
import { FontAwesome } from "@expo/vector-icons";
import BottomButton from "../../components/BottomButton";

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

const FindId: React.FC<NativeStackScreenProps<any, "Login">> = ({ navigation: { navigate } }) => {
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
      if (res.status === 200) {
        console.log(`success`);
        console.log(res.data);
        navigate("LoginStack", {
          screen: "FindIdResult",
          email: res.data,
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
        <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
        <Wrap>
          <Form>
            <FormTitleView>
              <IconWrap>
                <FontAwesome name="user-circle-o" size={15} color="black" />
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
        </Wrap>
        <BottomButton onPress={onSubmit} backgroundColor="#FF6534" title={"확인"} />
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default FindId;
