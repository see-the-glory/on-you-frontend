import React from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import BottomButton from "@components/atoms/BottomButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ClubCreationStackParamList } from "@navigation/ClubCreationStack";

const Container = styled.SafeAreaView`
  flex: 1;
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
  font-family: ${(props) => props.theme.koreanFontB};
  font-size: 24px;
  line-height: 33px;
  font-family: "NotoSansKR-Bold";
  margin-top: 20px;
`;

const H2 = styled.Text`
  font-family: ${(props) => props.theme.koreanFontR};
  font-size: 16px;
  line-height: 21px;
  color: #5c5c5c;
  margin-top: 12px;
`;

const ClubCreationFail: React.FC<NativeStackScreenProps<ClubCreationStackParamList, "ClubCreationFail">> = ({ navigation: { navigate } }) => {
  const goClubs = () => {
    return navigate("Tabs", { screen: "Find" });
  };

  return (
    <Container>
      <MainView>
        <SectionView>
          <Ionicons name="warning" size={38} color="red" />
          <H1>모임 개설에 실패했습니다.</H1>
          <H2>다시 시도해주세요.</H2>
        </SectionView>
      </MainView>
      <BottomButton onPress={goClubs} title={"완료"} />
    </Container>
  );
};

export default ClubCreationFail;
