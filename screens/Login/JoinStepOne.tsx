import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components/native";
import CustomText from "../../components/CustomText";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";

const Container = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  padding-top: 15px;
`;

const Wrap = styled.View`
  width: 100%;
  padding: 0 20px;
`;

const HeaderText = styled(CustomText)`
  color: #2b2b2b;
  font-size: 16px;
  line-height: 21px;
`;

const Item = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
`;

const RedText = styled(CustomText)`
  font-family: "NotoSansKR-Medium";
  margin-right: 5px;
  color: #ff714b;
  font-size: 16px;
  line-height: 21px;
`;

const ItemText = styled(CustomText)`
  font-family: "NotoSansKR-Medium";
  color: #6f6f6f;
  font-size: 16px;
  line-height: 21px;
`;

const LeftBox = styled.View`
  flex-direction: row;
  align-items: center;
`;

const RightBox = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Button = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 48px;
  background-color: ${(props: any) => (props.disabled ? "#d3d3d3" : "#295AF5")};
`;

const ButtonTitle = styled(CustomText)`
  font-family: "NotoSansKR-Bold";
  font-size: 18px;
  line-height: 24px;
  color: #fff;
`;

const JoinStepOne: React.FC<NativeStackScreenProps<any, "AuthStack">> = ({ navigation: { navigate } }) => {
  const [check, setCheck] = useState(false);
  const [check2, setCheck2] = useState(false);

  const openWebView = async (url: string) => {
    await WebBrowser.openBrowserAsync(url);
  };

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
        <Wrap>
          <HeaderText>On You에 오신 것을 환영합니다.</HeaderText>
          <HeaderText>앱 사용을 위해서는 아래의 약관동의와</HeaderText>
          <HeaderText>회원가입이 필요합니다.</HeaderText>

          <Item
            onPress={() => {
              if (!check) {
                openWebView("https://thin-helium-f6d.notion.site/5b292059b0d04e31925af2fd14e8271b");
                setCheck(true);
              } else setCheck(false);
            }}
          >
            <LeftBox>
              {!check ? (
                <Ionicons name="checkmark-circle-outline" size={26} color={"#FF714B"} style={{ marginLeft: -1, marginRight: 5 }} />
              ) : (
                <Ionicons name="checkmark-circle" size={26} color={"#FF714B"} style={{ marginLeft: -1, marginRight: 5 }} />
              )}
              <RedText>{`(필수)`}</RedText>
              <ItemText>{`On You 서비스 이용약관`}</ItemText>
            </LeftBox>
            <RightBox>
              <Feather name="chevron-right" color="#A0A0A0" size={20} style={{ marginRight: -7 }} />
            </RightBox>
          </Item>
          <Item
            onPress={() => {
              if (!check2) {
                openWebView("https://thin-helium-f6d.notion.site/cc73961fd43141d5baab97d1003a4cb3");
                setCheck2(true);
              } else setCheck2(false);
            }}
          >
            <LeftBox>
              {!check2 ? (
                <Ionicons name="checkmark-circle-outline" size={26} color={"#FF714B"} style={{ marginLeft: -1, marginRight: 5 }} />
              ) : (
                <Ionicons name="checkmark-circle" size={26} color={"#FF714B"} style={{ marginLeft: -1, marginRight: 5 }} />
              )}
              <RedText>{`(필수)`}</RedText>
              <ItemText>{`개인정보 수집 및 이용 동의서`}</ItemText>
            </LeftBox>
            <RightBox>
              <Feather name="chevron-right" color="#A0A0A0" size={20} style={{ marginRight: -7 }} />
            </RightBox>
          </Item>
        </Wrap>
        <Wrap>
          <Button onPress={goToNext} disabled={!check || !check2}>
            <ButtonTitle>{`다음`}</ButtonTitle>
          </Button>
        </Wrap>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default JoinStepOne;
