import React, { useState } from "react";
import { DeviceEventEmitter, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from "react-native";
import { orange100 } from "react-native-paper/lib/typescript/styles/colors";
import { useToast } from "react-native-toast-notifications";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { ClubApi, ClubCreationData, ClubCreationRequest } from "../../api";
import CustomText from "../../components/CustomText";
import CustomTextInput from "../../components/CustomTextInput";
import { RootState } from "../../redux/store/reducers";
import { ClubCreationStepThreeScreenProps } from "../../Types/Club";

const Container = styled.ScrollView``;

const MainView = styled.View`
  width: 100%;
`;

const HeaderView = styled.View`
  align-items: center;
  justify-content: center;
  padding: 20px 0px;
`;

const H1 = styled(CustomText)`
  font-size: 18px;
  line-height: 25px;
  font-family: "NotoSansKR-Bold";
`;

const H2 = styled(CustomText)`
  font-size: 14px;
  color: #5c5c5c;
`;

const Content = styled.View``;

const ContentItem = styled.View`
  margin-bottom: 20px;
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

const FooterView = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  margin: ${Platform.OS === "ios" ? 0 : 30}px 0px;
`;
const NextButton = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  background-color: ${(props: any) => (props.disabled ? "#c4c4c4" : "#295AF5")};
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled(CustomText)`
  font-size: 18px;
  line-height: 25px;
  font-family: "NotoSansKR-Bold";
  color: white;
`;

const ClubCreationStepThree: React.FC<ClubCreationStepThreeScreenProps> = ({
  route: {
    params: { category1, category2, clubName, maxNumber, isApproveRequired, phoneNumber, organizationName, imageURI },
  },
  navigation: { navigate },
}) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const toast = useToast();
  const [clubShortDesc, setClubShortDesc] = useState<string>("");
  const [clubLongDesc, setClubLongDesc] = useState<string>("");
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);

  const mutation = useMutation(ClubApi.createClub, {
    onSuccess: (res) => {
      console.log(res);
      setDisableSubmit(false);
      if (res.status === 200) {
        DeviceEventEmitter.emit("ClubListRefetch");
        return navigate("ClubCreationSuccess", {
          clubData: res.data,
        });
      } else {
        console.log(`createClub mutation success but please check status code`);
        console.log(res);
        toast.show(`${res.message} (status: ${res.status})`, {
          type: "warning",
        });
        return navigate("ClubCreationFail", {});
      }
    },
    onError: (error) => {
      console.log("--- createClub Error ---");
      console.log(`error: ${error}`);
      setDisableSubmit(false);
      toast.show(`${error}`, {
        type: "warning",
      });
      return navigate("ClubCreationFail", {});
    },
    onSettled: (res, error) => {},
  });

  const onSubmit = () => {
    if (category1 === -1 && category2 === -1) {
      toast.show(`카테고리가 설정되어있지 않습니다.`, {
        type: "warning",
      });
      return;
    } else if (category1 === -1 && category2 !== -1) {
      category1 = category2;
      category2 = -1;
    }

    const data: ClubCreationData = {
      category1Id: category1,
      clubName,
      clubMaxMember: maxNumber,
      clubShortDesc,
      clubLongDesc,
      contactPhone: phoneNumber,
      organizationName,
      isApproveRequired,
    };

    if (category2 !== -1) data.category2Id = category2;

    const splitedURI = new String(imageURI).split("/");

    const requestData: ClubCreationRequest =
      imageURI === null
        ? {
            image: null,
            data,
            token,
          }
        : {
            image: {
              uri: Platform.OS === "android" ? imageURI : imageURI.replace("file://", ""),
              type: "image/jpeg",
              name: splitedURI[splitedURI.length - 1],
            },
            data,
            token,
          };

    console.log(requestData);
    setDisableSubmit(true);
    mutation.mutate(requestData);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={50} style={{ flex: 1 }}>
        <Container
          contentContainerStyle={{
            width: "100%",
            height: "100%",
            paddingHorizontal: 20,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <MainView>
            <HeaderView>
              <H1>모임 소개</H1>
              <H2>모임을 소개해주세요.</H2>
            </HeaderView>
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
                <ItemText>ex) 매일 묵상훈련과 책모임을 함께하는 '경청'입니다!</ItemText>
              </ContentItem>
              <ContentItem>
                <ItemTitle>상세 소개</ItemTitle>
                <LongDescInput
                  placeholder="모임의 상세 소개글을 적어주세요."
                  placeholderTextColor="#B0B0B0"
                  value={clubLongDesc}
                  textAlign="left"
                  multiline={true}
                  maxLength={101}
                  textAlignVertical="top"
                  onChangeText={(value: string) => {
                    if (value.length > 100) {
                      toast.show(`상세 소개는 100자 제한입니다.`, {
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
          <FooterView>
            <NextButton onPress={onSubmit} disabled={clubShortDesc === "" || clubLongDesc === "" || disableSubmit}>
              <ButtonText>완료</ButtonText>
            </NextButton>
          </FooterView>
        </Container>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default ClubCreationStepThree;
