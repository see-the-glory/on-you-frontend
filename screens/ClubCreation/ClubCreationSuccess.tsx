import React from "react";
import { useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { ClubCreationSuccessScreenProps } from "../../Types/Club";
import { Ionicons } from "@expo/vector-icons";
import CustomText from "../../components/CustomText";

const Container = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const SectionView = styled.View<{ height: number }>`
  width: 100%;
  justify-content: center;
  align-items: center;
  height: ${(props) => props.height}px;
  padding: 0px 20px;
`;

const H1 = styled(CustomText)`
  font-size: 24px;
  line-height: 33px;
  font-family: "NotoSansKR-Bold";
  margin-top: 20px;
`;

const H2 = styled(CustomText)`
  font-size: 14px;
  line-height: 19px;
  color: #5c5c5c;
  margin-top: 12px;
  text-align: center;
`;

const NextButton = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  background-color: ${(props) => (props.disabled ? "#c4c4c4" : "#295AF5")};
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
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const mainHeight = (SCREEN_HEIGHT / 10) * 8;
  const footerHeight = SCREEN_HEIGHT - mainHeight;

  const goClubHome = () => {
    // Navigator stack reset 하는 거 찾아보기.
    return navigate("ClubStack", {
      screen: "ClubTopTabs",
      params: {
        clubData: clubData,
      },
    });
  };

  return (
    <Container>
      <SectionView height={mainHeight}>
        <Ionicons name="checkmark-circle" size={52} color="#FF714B" />
        <H1>모임 개설이 완료되었습니다.</H1>
        <H2>{`개설된 모임의 홈화면으로 가셔서\n상세 설정을 하실 수 있습니다.`}</H2>
      </SectionView>
      <SectionView height={footerHeight}>
        <NextButton onPress={goClubHome}>
          <ButtonText>완료</ButtonText>
        </NextButton>
      </SectionView>
    </Container>
  );
};

export default ClubCreationSuccess;
