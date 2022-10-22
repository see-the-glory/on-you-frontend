import React from "react";
import { useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { ClubCreationFailScreenProps } from "../../Types/Club";
import { Ionicons } from "@expo/vector-icons";
import CustomText from "../../components/CustomText";

const Container = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const SectionView = styled.View<{ height: number }>`
  width: 100%;
  height: ${(props) => props.height}px;
  justify-content: center;
  align-items: center;
  padding: 0px 20px;
`;

const H1 = styled(CustomText)`
  font-size: 24px;
  line-height: 33px;
  font-family: "NotoSansKR-Bold";
  margin-top: 20px;
`;

const H2 = styled(CustomText)`
  font-size: 16px;
  line-height: 21px;
  color: #5c5c5c;
  margin-top: 12px;
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

const ClubCreationFail: React.FC<ClubCreationFailScreenProps> = ({ navigation: { navigate } }) => {
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const mainHeight = (SCREEN_HEIGHT / 10) * 8;
  const footerHeight = SCREEN_HEIGHT - mainHeight;

  const goClubs = () => {
    return navigate("Tabs", {
      screen: "Clubs",
    });
  };

  return (
    <Container>
      <SectionView height={mainHeight}>
        <Ionicons name="warning" size={38} color="red" />
        <H1>모임 개설에 실패했습니다.</H1>
        <H2>다시 시도해주세요.</H2>
      </SectionView>
      <SectionView height={footerHeight}>
        <NextButton onPress={goClubs}>
          <ButtonText>완료</ButtonText>
        </NextButton>
      </SectionView>
    </Container>
  );
};

export default ClubCreationFail;
