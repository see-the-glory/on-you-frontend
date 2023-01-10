import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, createRef } from "react";
import { Keyboard, TouchableWithoutFeedback, Modal } from "react-native";
import styled from "styled-components/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const Container = styled.View`
  width: 100%;
  height: 95%;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding-horizontal: 20px;
  padding-top: 15px;
`;

const Wrap = styled.View`
  width: 100%;
`;

const ModalWrap = styled.View`
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 60px;
  margin-top: 30px;
  padding: 0 20px;
  border-bottom-width: 1px;
  border-color: #c4c4c4;
`;

const HeaderTitle = styled.Text`
  width: 85%;
  color: #2b2b2b;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
`;

const HeaderButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const Text = styled.Text`
  color: #2b2b2b;
  font-size: 16px;
`;

const RedText = styled.Text`
  margin-right: 2px;
  color: #ff714b;
  font-size: 16px;
`;

const TermsWrap = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
`;

const LeftBox = styled.View`
  flex-direction: row;
  align-items: center;
`;

const RightBox = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CheckBox = styled.View<{ check: boolean }>`
  align-items: center;
  width: 23px;
  height: 23px;
  border: 1px solid;
  border-radius: 100px;
  border-color: ${(props) => (props.check ? "white" : "#fff")}; ;
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
`;

const JoinStepOne: React.FC<NativeStackScreenProps<any, "AuthStack">> = ({ navigation: { navigate } }) => {
  const [check, setCheck] = useState(false);
  const [click, setClick] = useState(false);
  const [errortext, setErrortext] = useState(false);

  const goToNext = () => {
    navigate("LoginStack", {
      screen: "JoinStepTwo",
    });
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <Container>
        <Modal animationType={"fade"} transparent={false} visible={click}>
          <ModalWrap>
            <Header>
              <HeaderButton
                onPress={() => {
                  setClick(false);
                  setCheck(true);
                }}
              >
                <MaterialCommunityIcons name="chevron-left" color="#6F6F6F" size={24} style={{}} />
              </HeaderButton>
              <HeaderTitle>서비스 이용 약관</HeaderTitle>
            </Header>
          </ModalWrap>
        </Modal>
        <Wrap>
          <Text>On You에 오신 것을 환영합니다.</Text>
          <Text>앱 사용을 위해서는 아래의 약관동의와</Text>
          <Text>회원가입이 필요합니다.</Text>

          <TermsWrap onPress={() => setClick(true)}>
            <LeftBox>
              <CheckBox check={check}>{!check ? <Ionicons name="checkmark-circle-outline" size={20} color={"#FF714B"} /> : <Ionicons name="checkmark-circle" size={20} color={"#FF714B"} />}</CheckBox>
              <RedText>(필수)</RedText>
              <Text>On You 서비스 이용약관</Text>
            </LeftBox>
            <RightBox>
              <MaterialCommunityIcons name="chevron-right" color="#6F6F6F" size={24} style={{}} />
            </RightBox>
          </TermsWrap>
          {errortext === true ? <Error>입력을 다시 한번 확인해주세요.</Error> : null}
        </Wrap>
        <Wrap>
          <Button onPress={goToNext} disabled={!check}>
            <ButtonTitle>다음</ButtonTitle>
          </Button>
        </Wrap>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default JoinStepOne;
