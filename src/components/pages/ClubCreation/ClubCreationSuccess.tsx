import React, { useEffect } from "react";
import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import BottomButton from "@components/atoms/BottomButton";
import { BackHandler } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ClubCreationStackParamList } from "@navigation/ClubCreationStack";

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

const H1 = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontB};
  font-size: 24px;
  line-height: 33px;
  margin-top: 15px;
`;

const H2 = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 14px;
  line-height: 20px;
  color: #5c5c5c;
  margin-top: 12px;
  text-align: center;
`;

const ClubCreationSuccess: React.FC<NativeStackScreenProps<ClubCreationStackParamList, "ClubCreationSuccess">> = ({
  navigation: { navigate },
  route: {
    params: { clubData },
  },
}) => {
  const goClubHome = () => {
    return navigate("ClubStack", {
      screen: "ClubTopTabs",
      params: { clubId: clubData?.id, isNew: true },
    });
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      navigate("Tabs", { screen: "Find" });
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
      <BottomButton onPress={goClubHome} title={"완료"} />
    </Container>
  );
};

export default ClubCreationSuccess;
