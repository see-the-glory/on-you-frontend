import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, createRef, useLayoutEffect } from "react";
import { Keyboard, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Entypo } from "@expo/vector-icons";
import CustomText from "../../components/CustomText";
import CustomTextInput from "../../components/CustomTextInput";

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
  width: 30%;
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

const JoinStepFour: React.FC<NativeStackScreenProps<any, "AuthStack">> = ({
  navigation: { navigate, setOptions },
  route: {
    params: { name, email },
  },
}) => {
  const [userPw, setUserPw] = useState("");
  const [userPw2, setUserPw2] = useState("");
  const [errortext, setErrortext] = useState(false);

  const pwInputRef = createRef();
  const pwReg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;

  const validate = () => {
    if (!pwReg.test(userPw) || !pwReg.test(userPw2) || userPw !== userPw2 || userPw.length < 8 || userPw2.length < 8) {
      setErrortext(true);
      return;
    } else {
      setErrortext(false);
      navigate("LoginStack", {
        screen: "JoinStepFive",
        name,
        email,
        password: userPw,
      });
    }
  };

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigate("LoginStack", { screen: "JoinStepThree", name, email })}>
          <Entypo name="chevron-thin-left" size={20} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [name, email]);

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
          <AskText>비밀번호를 설정해주세요.</AskText>
          <SubText>로그인 정보로 활용됩니다.</SubText>
          <Input
            placeholder="영문, 숫자, 특수문자 포함 8자 이상"
            placeholderTextColor={"#B0B0B0"}
            secureTextEntry={true}
            autoCorrect={false}
            onChangeText={(pw: string) => setUserPw(pw)}
            ref={pwInputRef}
            returnKeyType="next"
            blurOnSubmit={false}
          />
          {errortext === true || !pwReg.test(userPw) ? <Error>입력을 다시 한번 확인해주세요.</Error> : null}
          <AskText>비밀번호를 다시 입력해주세요.</AskText>
          <Input
            placeholder="영문, 숫자, 특수문자 포함 8자 이상"
            placeholderTextColor={"#B0B0B0"}
            secureTextEntry={true}
            autoCorrect={false}
            onChangeText={(pw: string) => setUserPw2(pw)}
            ref={pwInputRef}
            returnKeyType="next"
            blurOnSubmit={false}
          />
          {/* {errortext === true || !pwReg.test(userPw2) ? <Error>입력을 다시 한번 확인해주세요.</Error> : null} */}
          {userPw !== userPw2 ? <Error>비밀번호가 일치하지 않습니다.</Error> : null}
        </Wrap>
        <Wrap>
          <Button onPress={validate} disabled={!pwReg.test(userPw) || !pwReg.test(userPw2) || userPw !== userPw2 || userPw.length < 8 || userPw2.length < 8}>
            <ButtonTitle>다음</ButtonTitle>
          </Button>
        </Wrap>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default JoinStepFour;
