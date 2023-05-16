import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, useLayoutEffect } from "react";
import { Keyboard, TouchableWithoutFeedback, TouchableOpacity, StatusBar } from "react-native";
import styled from "styled-components/native";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import CustomText from "../../components/CustomText";
import { useToast } from "react-native-toast-notifications";
import BottomButton from "../../components/BottomButton";

const Container = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
`;

const Wrap = styled.View`
  width: 100%;
  padding: 0px 20px;
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
  font-family: ${(props: any) => props.theme.koreanFontB};
  font-size: 20px;
  margin-top: 24px;
`;

const SubText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  color: #a0a0a0;
  font-size: 13px;
  margin-top: 7px;
`;

const Input = styled.TextInput`
  border-bottom-width: 1px;
  border-bottom-color: #b3b3b3;
  margin-top: 47px;
  font-size: 18px;
`;

const FieldContentView = styled.View`
  margin-top: 36px;
`;

const FieldContentLine = styled.View`
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const FieldContentOptionLine = styled.View`
  justify-content: center;
  align-items: flex-end;
  margin-bottom: 15px;
`;

const ChoiceButton = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const FieldContentText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 18px;
  margin-right: 10px;
`;

const SignUpChurch: React.FC<NativeStackScreenProps<any, "SignUpChurch">> = ({
  navigation: { navigate, setOptions, goBack },
  route: {
    params: { name, email, password, sex, birth, phone },
  },
}) => {
  const toast = useToast();
  const [check, setCheck] = useState(1);

  const validate = () => {
    if (check !== 1) return;

    navigate("SignUpStack", {
      screen: "SignUpConfirm",
      params: {
        name,
        email,
        password,
        sex,
        birth,
        phone,
        church: "시광교회",
      },
    });
  };

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => goBack()}>
          <Entypo name="chevron-thin-left" size={20} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [name, email, password, sex, birth, phone]);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <Container>
        <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
        <BorderWrap>
          <Border />
        </BorderWrap>
        <Wrap>
          <AskText>출석중인 교회를 알려주세요.</AskText>
          <SubText>{`시광교회 교인을 대상으로 사용되는 앱입니다.\n시광교회 교인만 가입 가능합니다.`}</SubText>
          <FieldContentView>
            <FieldContentLine>
              <ChoiceButton onPress={() => setCheck(1)} activeOpacity={0.5}>
                <FieldContentText>{`시광교회`}</FieldContentText>
                {check === 1 ? <MaterialCommunityIcons name="radiobox-marked" size={22} color="#295AF5" /> : <MaterialCommunityIcons name="radiobox-blank" size={22} color="#ABABAB" />}
              </ChoiceButton>
            </FieldContentLine>
            <FieldContentLine>
              <ChoiceButton
                onPress={() => {
                  setCheck(2);
                  toast.show(`타교인은 가입이 불가합니다.`, { type: "danger" });
                }}
                activeOpacity={0.5}
              >
                <FieldContentText>{`타교회`}</FieldContentText>
                {check === 2 ? <MaterialCommunityIcons name="radiobox-marked" size={22} color="#295AF5" /> : <MaterialCommunityIcons name="radiobox-blank" size={22} color="#ABABAB" />}
              </ChoiceButton>
            </FieldContentLine>
          </FieldContentView>
        </Wrap>
        <BottomButton onPress={validate} disabled={check !== 1} title={"다음"} />
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default SignUpChurch;
