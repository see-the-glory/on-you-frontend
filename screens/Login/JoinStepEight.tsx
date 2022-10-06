import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, createRef, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Keyboard, ScrollView, Alert, TouchableWithoutFeedback, useWindowDimensions } from "react-native";
import { useMutation } from "react-query";
import { CommonApi } from "../../api";
import { useDispatch } from "react-redux";
import { Login } from "../../store/Actions";
import styled from "styled-components/native";

const Container = styled.View`
  width: 100%;
  height: 95%;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding-horizontal: 20px;
  padding-top: 30px;
`;

const Wrap = styled.View`
  width: 100%;
`;

const BorderWrap = styled.View`
  width: 100%;
  height: 2px;
  background-color: #d0d0d0;
`;

const Border = styled.View`
  width: 80%;
  height: 2px;
  background-color: #295af5;
`;

const AskText = styled.Text`
  color: #000000;
  font-size: 20px;
  font-weight: bold;
  margin-top: 24px;
`;

const SubText = styled.Text`
  color: #a0a0a0;
  font-size: 12px;
  margin-top: 7px;
`;

const Input = styled.TextInput`
  border-bottom-width: 1px;
  border-bottom-color: #b3b3b3;
  margin-top: 47px;
  font-size: 18px;
`;

const Button = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 48px;
  background-color: ${(props) => (props.disabled ? "#d3d3d3" : "#295AF5")};
`;

const ButtonTitle = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: 700;
`;

const Error = styled.Text`
  color: #ff714b;
  font-size: 12px;
  margin-top: 7px;
  margin-bottom: 20px;
`;

const JoinStepEight: React.FC<NativeStackScreenProps<any, "AuthStack">> = ({ navigation: { navigate }, route: { params: name, email, password, sex, birth, phone } }) => {
  const [userName, setUserName] = useState(name);
  const [userEmail, setUserEmail] = useState(email);
  const [userPw, setUserPw] = useState(password);
  const [approvalMethod, setApprovalMethod] = useState(sex);
  const [birthNumber, setBirthNumber] = useState(birth);
  const [phoneNumber, setPhoneNumber] = useState(phone);
  const [church, setChurch] = useState("");
  const [errortext, setErrortext] = useState(false);
  const churchInputRef = createRef();

  const churchReg = /^([가-힣]{1,8})(교회)$/;

  useEffect(() => {
    const getData = async () => {
      try {
        // AsyncStorage에서 inputData에 저장된 값 가져오기
        const value = await AsyncStorage.getItem("userInfo");
        // value에 값이 있으면 콘솔에 찍어줘
        if (value !== null) {
          console.log(value);
        }
      } catch (error) {
        console.log(error);
      }
    };
    // 함수 실행
    getData();
  }, []);

  const storeData = async () => {
    try {
      await AsyncStorage.setItem(
        "userInfo",
        JSON.stringify({ name: userName.name, email: userName.email, password: userName.password, sex: userName.sex, birth: userName.birth, phone: userName.phone, church: church }),
        () => {
          console.log("유저정보 저장 완료");
        }
      );
      console.log("등록 완료");
    } catch (error) {
      console.log(error);
    }
  };

  const validate = () => {
    if (!churchReg.test(church)) {
      setErrortext(true);
      return;
    } else {
      setErrortext(false);
      storeData();
      navigate("LoginStack", {
        screen: "JoinStepNine",
        name: userName.name,
        email: userName.email,
        password: userName.password,
        sex: userName.sex,
        birth: userName.birth,
        phone: userName.phone,
        church: church,
      });
    }
  };

  return (
    <Container>
      <Wrap>
        <BorderWrap>
          <Border></Border>
        </BorderWrap>
        <AskText>출석중인 교회를 알려주세요.</AskText>
        <SubText>멤버 관리와, 소모임 소속 기관을 알기 위함 입니다.</SubText>
        <Input placeholder="교회를 입력해주세요. ex)OO교회" maxLength={10} onChangeText={(church) => setChurch(church)} value={church} ref={churchInputRef} returnKeyType="next" blurOnSubmit={false} />
        {errortext === true || !churchReg.test(church) ? <Error>입력을 다시 한번 확인해주세요.</Error> : null}
      </Wrap>
      <Wrap>
        <Button onPress={validate} disabled={!churchReg.test(church)}>
          <ButtonTitle>다음</ButtonTitle>
        </Button>
      </Wrap>
    </Container>
  );
};

export default JoinStepEight;
