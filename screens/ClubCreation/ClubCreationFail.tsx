import React from "react";
import { useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { ClubCreationFailScreenProps } from "../../types/Club";
import { Ionicons } from "@expo/vector-icons";

const Container = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const SectionView = styled.View<{ height: number }>`
  justify-content: center;
  align-items: center;
  height: ${(props) => props.height}px;
`;

const H1 = styled.Text`
  font-size: 32px;
  font-weight: 900;
  margin-top: 20px;
`;

const H2 = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: #5c5c5c;
  margin-top: 12px;
`;

const NextButton = styled.TouchableOpacity`
  width: 200px;
  height: 40px;
  background-color: #295af5;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  font-weight: 700;
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
