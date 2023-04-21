import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { StatusBar } from "react-native";
import styled from "styled-components/native";

const Container = styled.SafeAreaView`
  flex: 1;
`;

const TopView = styled.View`
  flex: 1;
  padding: 0px 20px;
  justify-content: flex-end;
  margin-bottom: 30px;
`;

const BottomView = styled.View`
  flex: 1;
  padding: 0px 20px;
`;

const TitleView = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Button = styled.TouchableHighlight`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 55px;
  border-radius: 30px;
  border-width: 1px;
  border-color: #6b8bf7;
  background-color: #fff;
  margin-bottom: 25px;
`;

const Title = styled.Text<{ color: string }>`
  font-family: "AppleSDGothicNeoSB";
  line-height: 26px;
  font-size: 22px;
  padding-left: 5px;
  color: ${(props: any) => props.color};
`;

const FindLoginInfo: React.FC<NativeStackScreenProps<any, "FindLoginInfo">> = ({ navigation: { navigate } }) => {
  const [findEmailColor, setFindEmailColor] = useState<string>("black");
  const [findPasswordColor, setFindPasswordColor] = useState<string>("black");

  const goToFindEmail = () => {
    navigate("LoginStack", { screen: "FindEmail" });
  };

  const goToFindPasswrod = () => {
    navigate("LoginStack", { screen: "FindPassword" });
  };

  return (
    <Container>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <TopView>
        <Button onPressIn={() => setFindEmailColor("white")} onPressOut={() => setFindEmailColor("black")} onPress={goToFindEmail} underlayColor="#6B8BF7">
          <TitleView>
            <Title color={findEmailColor}>E-mail 찾기</Title>
          </TitleView>
        </Button>
        <Button onPressIn={() => setFindPasswordColor("white")} onPressOut={() => setFindPasswordColor("black")} onPress={goToFindPasswrod} underlayColor="#6B8BF7">
          <TitleView>
            <Title color={findPasswordColor}>비밀번호 찾기</Title>
          </TitleView>
        </Button>
      </TopView>
      <BottomView></BottomView>
    </Container>
  );
};

export default FindLoginInfo;
