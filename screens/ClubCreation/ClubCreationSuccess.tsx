import React, { useEffect } from "react";
import styled from "styled-components/native";
import { ClubCreationSuccessScreenProps } from "../../Types/Club";
import { Feather } from "@expo/vector-icons";
import CustomText from "../../components/CustomText";
import BottomButton from "../../components/BottomButton";
import { BackHandler } from "react-native";

const Container = styled.SafeAreaView`
  justify-content: center;
  align-items: center;
`;

const MainView = styled.View`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const SectionView = styled.View`
  justify-content: center;
  align-items: center;
  padding: 0px 20px;
  margin-bottom: 80px;
`;

const H1 = styled(CustomText)`
  font-size: 24px;
  line-height: 33px;
  font-family: "NotoSansKR-Bold";
  margin-top: 15px;
`;

const H2 = styled(CustomText)`
  font-size: 14px;
  line-height: 20px;
  color: #5c5c5c;
  margin-top: 12px;
  text-align: center;
`;

const ClubCreationSuccess: React.FC<ClubCreationSuccessScreenProps> = ({
  navigation: { navigate },
  route: {
    params: { clubData },
  },
}) => {
  const goClubHome = () => {
    return navigate("ClubStack", {
      screen: "ClubTopTabs",
      params: { clubData },
    });
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      navigate("Tabs", { screen: "Clubs" });
      return true;
    });
    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <Container>
      <MainView>
        <SectionView>
          <Feather name="check" size={58} color="#CCCCCC" />
          <H1>모임 개설이 완료되었습니다.</H1>
          <H2>{`개설된 모임의 홈화면으로 가셔서\n상세 설정을 하실 수 있습니다.`}</H2>
        </SectionView>
      </MainView>
      <BottomButton onPress={goClubHome} backgroundColor={"#FF6534"} title={"완료"} />
    </Container>
  );
};

export default ClubCreationSuccess;
