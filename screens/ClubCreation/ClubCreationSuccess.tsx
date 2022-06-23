import React, { useState } from "react";
import { ActivityIndicator, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { ClubCreationSuccessScreenProps } from "../../types/club";
import { Ionicons } from "@expo/vector-icons";
import { Club, ClubApi, ClubDataRequest, ClubResponse } from "../../api";
import { useQuery } from "react-query";

const Loader = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

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

const ClubCreationSuccess: React.FC<ClubCreationSuccessScreenProps> = ({
  navigation: { navigate, reset },
  route: {
    params: { clubId },
  },
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const mainHeight = (SCREEN_HEIGHT / 10) * 8;
  const footerHeight = SCREEN_HEIGHT - mainHeight;
  const {
    isLoading: clubDataLoading,
    data: clubData,
    isRefetching: isRefetchingClubData,
  } = useQuery<ClubResponse>(["getClubs", clubId], ClubApi.getClub);

  const goClubHome = () => {
    if (clubData?.resultCode === "OK") {
      return navigate("ClubStack", {
        screen: "ClubTopTabs",
        params: {
          clubData: clubData.data,
        },
      });
    } else {
      return navigate("Tabs", {
        screen: "Clubs",
      });
    }
  };

  return clubDataLoading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <Container>
      <SectionView height={mainHeight}>
        <Ionicons name="checkmark-circle" size={38} color="#FF714B" />
        <H1>모임 개설이 완료되었습니다.</H1>
        <H2>개설된 모임의 홈화면에서 상세 설정을 하실 수 있습니다.</H2>
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
