import React, { useEffect } from "react";
import { BackHandler, StatusBar, View } from "react-native";
import { useToast } from "react-native-toast-notifications";
import styled from "styled-components/native";

const Container = styled.View`
  width: 100%;
  height: 100%;
`;

const Header = styled.View`
  padding-left: 20px;
  margin-top: 200px;
  margin-bottom: 120px;
`;

const LineView = styled.View`
  height: 1.5px;
  background-color: ${(props: any) => props.theme.infoColor};
`;

const HeaderTitle = styled.Text`
  font-family: ${(props: any) => props.theme.englishFontM};
  font-size: 40px;
  line-height: 43px;
`;

const HeaderText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 16px;
  color: ${(props: any) => props.theme.infoColor};
  margin-top: 10px;
`;

const Content = styled.View`
  flex-direction: row;
  padding-right: 30px;
`;

const ContentText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 16px;
`;

const Parking = ({ navigation }) => {
  const toast = useToast();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      return true;
    });
    const unsubscribe = navigation.addListener("gestureEnd", () => {});

    return () => {
      backHandler.remove();
      unsubscribe();
    };
  }, [navigation]);

  return (
    <Container>
      <StatusBar translucent backgroundColor={"transparent"} barStyle={"dark-content"} />
      <Header>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <HeaderTitle>{`The server`}</HeaderTitle>
          <LineView style={{ width: "100%", marginLeft: 20, marginBottom: 3 }} />
        </View>
        <HeaderTitle>{`is down :()`}</HeaderTitle>
        <HeaderText>{`서버가 중단되었습니다.`}</HeaderText>
      </Header>
      <Content>
        <LineView style={{ flex: 1, marginRight: 20, marginTop: 10 }} />
        <ContentText>{`빠른 시간 내로 복구될 예정이니\n잠시 후 다시 방문해주세요.`}</ContentText>
      </Content>
    </Container>
  );
};

export default Parking;
