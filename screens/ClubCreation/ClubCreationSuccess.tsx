import React from "react";
import styled from "styled-components/native";
import { ClubCreationSuccessScreenProps } from "../../Types/Club";
import { Feather } from "@expo/vector-icons";
import CustomText from "../../components/CustomText";
import { Platform } from "react-native";

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
  line-height: 19px;
  color: #5c5c5c;
  margin-top: 12px;
  text-align: center;
`;

const NextButtonView = styled.View`
  width: 100%;
  position: absolute;
  bottom: 0;
  margin: 30px 0px;
  padding: 0px 20px;
`;

const NextButton = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  background-color: #ff6534;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled(CustomText)`
  font-size: 18px;
  line-height: 25px;
  font-family: "NotoSansKR-Bold";
  color: white;
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
      params: {
        clubData: clubData,
      },
    });
  };

  return (
    <Container>
      <MainView>
        <SectionView>
          <Feather name="check" size={58} color="#CCCCCC" />
          <H1>모임 개설이 완료되었습니다.</H1>
          <H2>{`개설된 모임의 홈화면으로 가셔서\n상세 설정을 하실 수 있습니다.`}</H2>
        </SectionView>
      </MainView>
      <NextButtonView>
        <NextButton onPress={goClubHome}>
          <ButtonText>완료</ButtonText>
        </NextButton>
      </NextButtonView>
    </Container>
  );
};

export default ClubCreationSuccess;
