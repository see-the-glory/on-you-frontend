import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, useEffect, createRef } from "react";
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
  width: 60%;
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

const JoinStepSix: React.FC<NativeStackScreenProps<any, "AuthStack">> = ({ navigation: { navigate }, route: { params: name, email, password, sex } }) => {
  const [userName, setUserName] = useState(name);
  const [userEmail, setUserEmail] = useState(email);
  const [userPw, setUserPw] = useState(password);
  const [approvalMethod, setApprovalMethod] = useState(sex);
  const [birthNumber, setBirthNumber] = useState("");
  const [errortext, setErrortext] = useState(false);
  const birthInputRef = createRef();

  const birthReg = /^(19[0-9][0-9]|20\d{2})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;

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
      await AsyncStorage.setItem("userInfo", JSON.stringify({ name: userName.name, email: userName.email, password: userName.password, sex: userName.sex, birth: birthNumber }), () => {
        console.log("유저정보 저장 완료");
      });
      console.log("등록 완료");
    } catch (error) {
      console.log(error);
    }
  };

  const validate = () => {
    if (!birthReg.test(birthNumber)) {
      setErrortext(true);
      return;
    } else {
      setErrortext(false);
      storeData();
      navigate("LoginStack", {
        screen: "JoinStepSeven",
        name: userName.name,
        email: userName.email,
        password: userName.password,
        sex: userName.sex,
        birth: birthNumber,
      });
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <Container>
        <Wrap>
          <BorderWrap>
            <Border></Border>
          </BorderWrap>
          <AskText>생년월일을 입력해주세요.</AskText>
          <SubText>정확한 생년월일을 입력해주세요.</SubText>
          <Input
            keyboardType="numeric"
            placeholder="yyyy-MM-dd"
            placeholderTextColor={"#B0B0B0"}
            maxLength={8}
            onChangeText={(birth) => setBirthNumber(birth)}
            value={birthNumber}
            ref={birthInputRef}
            returnKeyType="next"
            blurOnSubmit={false}
          />
          {errortext === true || !birthReg.test(birthNumber) ? <Error>입력을 다시 한번 확인해주세요.</Error> : null}
        </Wrap>
        <Wrap>
          <Button onPress={validate} disabled={!birthReg.test(birthNumber)}>
            <ButtonTitle>다음</ButtonTitle>
          </Button>
        </Wrap>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default JoinStepSix;
