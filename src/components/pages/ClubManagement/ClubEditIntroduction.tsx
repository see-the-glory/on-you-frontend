import { Entypo } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, StatusBar, TouchableOpacity } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { useMutation, useQueryClient } from "react-query";
import styled from "styled-components/native";
import { ClubApi, ClubResponse, ClubUpdateRequest, ErrorResponse } from "api";
import { ClubManagementStackParamList } from "@navigation/ClubManagementStack";
import CustomText from "@components/atoms/CustomText";
import CustomTextInput from "@components/atoms/CustomTextInput";

const Container = styled.View`
  flex: 1;
`;

const MainView = styled.ScrollView``;

const Content = styled.View`
  padding: 20px;
  margin-bottom: 50px;
`;
const ContentItem = styled.View`
  width: 100%;
  flex: 1;
  margin-bottom: 30px;
`;

const ItemTitleView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const InfoText = styled(CustomText)`
  font-size: 12px;
  color: #b5b5b5;
`;

const ItemTitle = styled(CustomText)`
  font-size: 13px;
  line-height: 19px;
  margin-bottom: 8px;
`;

const ItemText = styled(CustomText)`
  font-size: 11px;
  line-height: 15px;
  padding: 6px 0px;
  color: #8c8c8c;
`;

const ShortDescInput = styled(CustomTextInput)`
  width: 100%;
  font-size: 14px;
  line-height: 20px;
  padding: 12px;
  background-color: #f3f3f3;
  text-align: center;
`;

const LongDescInput = styled(CustomTextInput)`
  width: 100%;
  height: 250px;
  font-size: 14px;
  line-height: 20px;
  padding: 12px;
  background-color: #f3f3f3;
`;

const ClubEditIntroduction: React.FC<NativeStackScreenProps<ClubManagementStackParamList, "ClubEditIntroduction">> = ({
  navigation: { navigate, setOptions, goBack },
  route: {
    params: { clubId, clubData },
  },
}) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [clubShortDesc, setClubShortDesc] = useState(clubData?.clubShortDesc ?? "");
  const [clubLongDesc, setClubLongDesc] = useState(clubData?.clubLongDesc ?? "");
  const shortDescMax = 20;
  const longDescMax = 3000;
  const mutation = useMutation<ClubResponse, ErrorResponse, ClubUpdateRequest>(ClubApi.updateClub, {
    onSuccess: (res) => {
      queryClient.setQueryData<ClubResponse>(["getClub", clubId], res);
      toast.show(`저장이 완료되었습니다.`, { type: "success" });
      goBack();
    },
    onError: (error) => {
      console.log(`API ERROR | updateClub ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  useEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => goBack()}>
          <Entypo name="chevron-thin-left" size={20} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () =>
        mutation.isLoading ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity onPress={save}>
            <CustomText style={{ color: "#2995FA", fontSize: 14, lineHeight: 20 }}>저장</CustomText>
          </TouchableOpacity>
        ),
    });
  }, [clubShortDesc, clubLongDesc, mutation.isLoading]);

  const save = () => {
    const updateData: ClubUpdateRequest = {
      data: {
        clubShortDesc: clubShortDesc.trim(),
        clubLongDesc: clubLongDesc.trim(),
        category1Id: clubData?.categories ? clubData?.categories[0]?.id ?? -1 : -1,
        category2Id: clubData?.categories ? clubData?.categories[1]?.id ?? -1 : -1,
      },
      clubId,
    };

    if (updateData?.data?.category2Id === -1) delete updateData?.data?.category2Id;

    mutation.mutate(updateData);
  };

  return (
    <Container>
      <StatusBar translucent backgroundColor={"transparent"} barStyle={"dark-content"} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={10} style={{ flex: 1 }}>
        <MainView>
          <Content>
            <ContentItem>
              <ItemTitleView>
                <ItemTitle>간단 소개</ItemTitle>
                <InfoText>{`${clubShortDesc.length} / ${shortDescMax}`}</InfoText>
              </ItemTitleView>
              <ShortDescInput
                placeholder="20자 이내로 간단 소개글을 적어주세요."
                placeholderTextColor="#B0B0B0"
                value={clubShortDesc}
                textAlign="center"
                maxLength={shortDescMax}
                textAlignVertical="center"
                onChangeText={(value: string) => setClubShortDesc(value)}
                onEndEditing={() => setClubShortDesc((prev) => prev.trim())}
                includeFontPadding={false}
              />
              <ItemText>{`ex) 묵상훈련을 하는 책모임입니다.`}</ItemText>
            </ContentItem>

            <ContentItem>
              <ItemTitleView>
                <ItemTitle>상세 소개</ItemTitle>
                <InfoText>{`${clubLongDesc.length} / ${longDescMax}`}</InfoText>
              </ItemTitleView>
              <LongDescInput
                placeholder="모임의 상세 소개글을 적어주세요."
                placeholderTextColor="#B0B0B0"
                value={clubLongDesc}
                textAlign="left"
                multiline={true}
                maxLength={longDescMax}
                textAlignVertical="top"
                onChangeText={(value: string) => setClubLongDesc(value)}
                onEndEditing={() => setClubLongDesc((prev) => prev.trim())}
                includeFontPadding={false}
              />
            </ContentItem>
          </Content>
        </MainView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default ClubEditIntroduction;
