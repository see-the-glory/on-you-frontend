import React, { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { ClubApi, ClubUpdateRequest, ClubUpdateResponse, ErrorResponse } from "../../api";
import CustomText from "../../components/CustomText";
import CustomTextInput from "../../components/CustomTextInput";
import { RootState } from "../../redux/store/reducers";
import { ClubEditIntroductionProps } from "../../Types/Club";

const Container = styled.SafeAreaView`
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

const Item = styled.View`
  width: 100%;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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
  line-height: 19px;
  padding: 12px;
  background-color: #f3f3f3;
  text-align: center;
`;

const LongDescInput = styled(CustomTextInput)`
  width: 100%;
  height: 250px;
  font-size: 14px;
  line-height: 19px;
  padding: 12px;
  background-color: #f3f3f3;
`;

const ClubEditIntroduction: React.FC<ClubEditIntroductionProps> = ({
  navigation: { navigate, setOptions, goBack },
  route: {
    params: { clubData },
  },
}) => {
  const toast = useToast();
  const [clubShortDesc, setClubShortDesc] = useState(clubData.clubShortDesc ?? "");
  const [clubLongDesc, setClubLongDesc] = useState(clubData.clubLongDesc ?? "");
  const mutation = useMutation<ClubUpdateResponse, ErrorResponse, ClubUpdateRequest>(ClubApi.updateClub, {
    onSuccess: (res) => {
      toast.show(`저장이 완료되었습니다.`, { type: "success" });
      navigate("ClubManagementMain", { clubData: res.data, refresh: true });
    },
    onError: (error) => {
      console.log(`API ERROR | updateClub ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  useEffect(() => {
    setOptions({
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
    let updateData: ClubUpdateRequest = {
      data: {
        clubShortDesc,
        clubLongDesc,
        category1Id: clubData?.categories ? clubData.categories[0]?.id ?? -1 : -1,
        category2Id: clubData?.categories ? clubData.categories[1]?.id ?? -1 : -1,
      },
      clubId: clubData.id,
    };

    if (updateData?.data?.category2Id === -1) delete updateData?.data?.category2Id;

    mutation.mutate(updateData);
  };

  return (
    <Container>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={10} style={{ flex: 1 }}>
        <MainView>
          <Content>
            <ContentItem>
              <ItemTitle>간단 소개</ItemTitle>
              <ShortDescInput
                placeholder="20자 이내로 간단 소개글을 적어주세요."
                placeholderTextColor="#B0B0B0"
                value={clubShortDesc}
                textAlign="center"
                maxLength={21}
                textAlignVertical="center"
                onChangeText={(value: string) => {
                  if (value.length > 20) {
                    toast.show(`간단 소개는 20자 제한입니다.`, {
                      type: "warning",
                    });
                  } else setClubShortDesc(value);
                }}
                onEndEditing={() => setClubShortDesc((prev) => prev.trim())}
                includeFontPadding={false}
              />
              <ItemText>{`ex) 묵상훈련을 하는 책모임입니다.`}</ItemText>
            </ContentItem>

            <ContentItem>
              <ItemTitle>상세 소개</ItemTitle>
              <LongDescInput
                placeholder="모임의 상세 소개글을 적어주세요."
                placeholderTextColor="#B0B0B0"
                value={clubLongDesc}
                textAlign="left"
                multiline={true}
                maxLength={1001}
                textAlignVertical="top"
                onChangeText={(value: string) => {
                  if (value.length > 1000) {
                    toast.show(`상세 소개는 1000자 제한입니다.`, {
                      type: "warning",
                    });
                  } else setClubLongDesc(value);
                }}
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
