import React, { useState, useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TouchableOpacity, Platform, KeyboardAvoidingView, DeviceEventEmitter, ActivityIndicator, ScrollView, View } from "react-native";
import styled from "styled-components/native";
import ImagePicker from "react-native-image-crop-picker";
import { useMutation, useQueryClient } from "react-query";
import { BaseResponse, ErrorResponse, UserApi, UserUpdateRequest } from "api";
import Collapsible from "react-native-collapsible";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import DatePicker from "react-native-date-picker";
import CustomText from "@components/atoms/CustomText";
import { useToast } from "react-native-toast-notifications";
import CircleIcon from "@components/atoms/CircleIcon";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import { lightTheme } from "app/theme";
import { ProfileStackParamList } from "@navigation/ProfileStack";

const HeaderView = styled.View`
  align-items: center;
  justify-content: center;
`;

const Content = styled.View`
  width: 100%;
  margin-bottom: 20px;
`;

const ContentItem = styled.View<{ error?: boolean }>`
  width: 100%;
  flex: 1;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => (props.error ? props.theme.accentColor : "#cecece")};
  margin: 10px 0px;
`;

const ItemTitle = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 13px;
  color: #b0b0b0;
  margin-bottom: 5px;
`;

const ItemText = styled.Text<{ disabled: boolean }>`
  font-family: ${(props: any) => props.theme.koreanFontR};
  padding: 2px 0px;
  font-size: 15px;
  line-height: 22px;
  color: ${(props: any) => (props.disabled ? "#6F6F6F" : "black")};
`;

const ItemTextInput = styled.TextInput`
  font-family: ${(props: any) => props.theme.koreanFontR};
  font-size: 15px;
  flex: 1;
  margin-bottom: ${Platform.OS === "ios" ? 3 : 0}px;
`;

const ValidationView = styled.View`
  margin-top: 3px;
  height: 15px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;
const ValidationItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 8px;
`;

const ValidationText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR};
  color: ${(props: any) => props.theme.accentColor};
  font-size: 10px;
`;

const RadioButtonView = styled.View`
  flex-direction: row;
  align-items: center;
`;

const RadioButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-right: 10px;
`;

const ImagePickerButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const ProfileText = styled.Text`
  font-family: ${(props: any) => props.theme.koreanFontR}
  margin-top: 10px;
  font-size: 14px;
  color: #2995fa;
`;

const CollapsibleButton = styled.TouchableOpacity``;

const DateView = styled.View`
  width: 100%;
  align-items: center;
  margin: 5px 0px;
`;

const AccountEdit: React.FC<NativeStackScreenProps<ProfileStackParamList, "AccountEdit">> = ({
  route: {
    params: { userData },
  },
  navigation: { navigate, goBack, setOptions },
}) => {
  const queryClient = useQueryClient();
  const [imageURI, setImageURI] = useState<string | null>(null);
  const [name, setName] = useState<string>(userData?.name ?? "");
  const [nameErrorCheck, setNameErrorCheck] = useState<boolean>(false);
  const [sex, setSex] = useState<string | null>(userData?.sex ?? null);
  const [shouldSelectSex, setShuldSelectSex] = useState<boolean>(userData?.sex ? false : true);
  const [birthday, setBirthday] = useState<string | null>(userData?.birthday ?? "없음");
  const [phoneNumber, setPhoneNumber] = useState<string | null>(userData?.phoneNumber ?? "없음");
  const [organizationName, setOrganizationName] = useState<string>(userData?.organizationName ?? "없음");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const toast = useToast();
  const imageSize = 100;
  const specialChar = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]+/;

  const mutation = useMutation<BaseResponse, ErrorResponse, UserUpdateRequest>(UserApi.updateUserInfo, {
    onSuccess: (res) => {
      toast.show("저장에 성공하였습니다.", { type: "success" });
      DeviceEventEmitter.emit("ProfileRefresh");
      DeviceEventEmitter.emit("HomeAllRefetch");
      queryClient.invalidateQueries(["getMyProfile"]);
      goBack();
    },
    onError: (error) => {
      console.log(`API ERROR | updateUserInfo ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const save = () => {
    if (nameErrorCheck) return toast.show(`이름을 다시 설정해주세요.`, { type: "warning" });

    const data = {
      birthday: birthday?.trim() === "" ? null : birthday?.trim() ?? null,
      sex: sex ?? null,
      name: name.trim() === "" ? userData?.name : name.trim(),
      organization: organizationName.trim(),
      phoneNumber: phoneNumber?.trim() === "" ? null : phoneNumber?.trim() ?? null,
    };

    const updateData: UserUpdateRequest = { data };

    if (imageURI) {
      const splitedURI = imageURI?.split("/");
      updateData.image = {
        uri: Platform.OS === "android" ? imageURI : imageURI.replace("file://", ""),
        type: "image/jpeg",
        name: splitedURI[splitedURI.length - 1],
      };
    }
    mutation.mutate(updateData);
  };

  const pickImage = async () => {
    try {
      let image = await ImagePicker.openPicker({ mediaType: "photo" });
      let croped = await ImagePicker.openCropper({
        mediaType: "photo",
        path: image.path,
        width: 1080,
        height: 1080,
        cropperCancelText: "Cancel",
        cropperChooseText: "Check",
        cropperToolbarTitle: "이미지를 크롭하세요",
        forceJpg: true,
      });

      if (croped) setImageURI(croped.path);
    } catch (e) {}
  };

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
          <TouchableOpacity onPress={save} disabled={nameErrorCheck}>
            <CustomText style={{ color: "#2995FA", fontSize: 14, lineHeight: 20, opacity: nameErrorCheck ? 0.3 : 1 }}>저장</CustomText>
          </TouchableOpacity>
        ),
    });
  }, [name, sex, birthday, phoneNumber, organizationName, imageURI, nameErrorCheck, mutation.isLoading]);

  useEffect(() => {
    if (phoneNumber?.length === 10) {
      setPhoneNumber(phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"));
    }
    if (phoneNumber?.length === 12) {
      setPhoneNumber(phoneNumber.replace(/-/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"));
    }
    if (phoneNumber?.length === 13) {
      setPhoneNumber(phoneNumber.replace(/-/g, "").replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3"));
    }
  }, [phoneNumber]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={100} style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        contentContainerStyle={{
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <View style={{ width: "100%" }}>
          <HeaderView>
            <ImagePickerButton onPress={pickImage} activeOpacity={1}>
              <CircleIcon size={imageSize} uri={imageURI ?? userData?.thumbnail} />
              <ProfileText onPress={pickImage}>{`프로필 사진 설정`}</ProfileText>
            </ImagePickerButton>
          </HeaderView>
          <Content>
            <ContentItem error={nameErrorCheck} style={{ marginBottom: 0 }}>
              <ItemTitle>{`이름`}</ItemTitle>
              <ItemTextInput
                value={name}
                placeholder={`홍길동`}
                placeholderTextColor="#B0B0B0"
                maxLength={12}
                onEndEditing={() => {
                  setName((prev) => prev.trim());
                }}
                onChangeText={(text: string) => {
                  setName(text);
                  if (!nameErrorCheck && specialChar.test(text)) setNameErrorCheck(true);
                  if (nameErrorCheck && !specialChar.test(text)) setNameErrorCheck(false);
                }}
                returnKeyType="done"
                returnKeyLabel="done"
                includeFontPadding={false}
              />
            </ContentItem>
            <ValidationView>
              {specialChar.test(name) ? (
                <ValidationItem>
                  <AntDesign name="check" size={12} color={lightTheme.accentColor} />
                  <ValidationText>{` 특수문자 불가능`}</ValidationText>
                </ValidationItem>
              ) : (
                <></>
              )}
            </ValidationView>
            <ContentItem style={{ marginTop: 2 }}>
              <ItemTitle>{`성별`}</ItemTitle>
              <RadioButtonView>
                <RadioButton onPress={() => setSex("M")} disabled={!shouldSelectSex}>
                  <Ionicons
                    name={sex === "M" ? "radio-button-on" : "radio-button-off"}
                    size={16}
                    color={sex !== "M" || !shouldSelectSex ? "rgba(0, 0, 0, 0.3)" : lightTheme.accentColor}
                    style={{ marginRight: 5 }}
                  />
                  <ItemText disabled={!shouldSelectSex}>{`남`}</ItemText>
                </RadioButton>
                <RadioButton onPress={() => setSex("F")} disabled={!shouldSelectSex}>
                  <Ionicons
                    name={sex === "F" ? "radio-button-on" : "radio-button-off"}
                    size={16}
                    color={sex !== "F" || !shouldSelectSex ? "rgba(0, 0, 0, 0.3)" : lightTheme.accentColor}
                    style={{ marginRight: 5 }}
                  />
                  <ItemText disabled={!shouldSelectSex}>{`여`}</ItemText>
                </RadioButton>
              </RadioButtonView>
            </ContentItem>
            <ContentItem>
              <ItemTitle>{`이메일`}</ItemTitle>
              <ItemText>{userData?.email}</ItemText>
            </ContentItem>
            <ContentItem>
              <ItemTitle>{`생년월일`}</ItemTitle>
              <CollapsibleButton collapsed={showDatePicker} onPress={() => setShowDatePicker((prev) => !prev)}>
                <ItemText>{birthday}</ItemText>
              </CollapsibleButton>
              {Platform.OS === "android" ? (
                <Collapsible collapsed={!showDatePicker}>
                  <DateView style={{}}>
                    <DatePicker textColor={"#000000"} date={new Date(birthday)} mode="date" onDateChange={(value) => setBirthday(value.toISOString().split("T")[0])} />
                  </DateView>
                </Collapsible>
              ) : (
                <Collapsible collapsed={!showDatePicker}>
                  <DateView>
                    <RNDateTimePicker textColor={"#000000"} mode="date" value={new Date(birthday)} display="spinner" onChange={(_, value: Date) => setBirthday(value.toISOString().split("T")[0])} />
                  </DateView>
                </Collapsible>
              )}
            </ContentItem>
            <ContentItem>
              <ItemTitle>{`연락처`}</ItemTitle>
              <ItemTextInput
                keyboardType="numeric"
                value={phoneNumber}
                placeholder={`010-000-0000`}
                placeholderTextColor="#B0B0B0"
                maxLength={13}
                onEndEditing={() => setPhoneNumber((prev) => prev.trim())}
                onChangeText={(text: string) => setPhoneNumber(text)}
                returnKeyType="done"
                returnKeyLabel="done"
                includeFontPadding={false}
              />
            </ContentItem>
            <ContentItem>
              <ItemTitle>{`교회`}</ItemTitle>
              {/* <ItemText>{`시광교회`}</ItemText> */}
              <ItemTextInput
                value={organizationName}
                placeholder={`시광교회`}
                placeholderTextColor="#B0B0B0"
                maxLength={20}
                onEndEditing={() => setOrganizationName((prev) => prev.trim())}
                onChangeText={(text: string) => setOrganizationName(text)}
                returnKeyType="done"
                returnKeyLabel="done"
                includeFontPadding={false}
              />
            </ContentItem>
          </Content>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AccountEdit;
