import React, { useState, useEffect, useRef } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TouchableOpacity, Text, NativeModules, Alert, Platform } from "react-native";
import { Keyboard, TouchableWithoutFeedback, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import * as ImagePicker from "expo-image-picker";
import { useMutation, useQuery } from "react-query";
import { useSelector, useDispatch } from "react-redux";
import { UserApi, UserUpdateRequest, UserInfoRequest } from "../../api";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { EditProfileScreenProps } from "../../Types/User";
import { NavigationRouteContext } from "@react-navigation/native";
import Collapsible from "react-native-collapsible";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import DatePicker from "react-native-date-picker";
import CustomText from "../../components/CustomText";
import { useToast } from "react-native-toast-notifications";
import CustomTextInput from "../../components/CustomTextInput";

const Container = styled.View`
  flex: 1;
  padding-left: 15px;
  padding-right: 15px;
`;

const ImagePickerView = styled.View`
  width: 100%;
  height: 130px;
  align-items: center;
  margin: 20px 0;
`;

const ImagePickerWrap = styled.View`
  width: 85px;
  height: 85px;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  border: 1px;
  border-color: rgb(255, 255, 255);
  background-color: white;
  box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.25);
  margin-top: 15px;
`;

const ImagePickerButton = styled.TouchableOpacity<{ height: number }>`
  width: 80px;
  height: 80px;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
`;

const PickedImage = styled.Image<{ height: number }>`
  width: 100%;
  height: 100%;
  border-radius: 50px;
`;

const ProfileText = styled.Text`
  margin-top: 10px;
  font-size: 12px;
  font-weight: normal;
  color: #2995fa;
`;

const Form = styled.View`
  margin-bottom: 20px;
  padding: 0 5px;
`;

const Title = styled(CustomText)`
  color: #b0b0b0;
  font-size: 10px;
  line-height: 15px;
  margin-bottom: 10px;
`;

const Input = styled(CustomTextInput)`
  font-size: 14px;
  line-height: 20px;
  border-bottom-width: 1px;
  border-bottom-color: #cecece;
  padding-bottom: 5px;
`;

const TextBtn = styled.TouchableOpacity``;

const FieldContentView = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: #cecece;
  padding-bottom: 5px;
  flex-direction: row;
`;
const FieldContentLine = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const FieldContentText = styled.Text`
  font-size: 14px;
  margin-right: 10px;
`;

const Button = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const CategoryView = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
`;

const CategoryItem = styled.TouchableOpacity<{ selected: boolean }>`
  min-width: 60px;
  height: 25px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.selected ? "#295AF5" : "white")};
  border-radius: 30px;
  border: 0.5px solid #bbbbbb;
  margin-right: 10px;
  margin-bottom: 10px;
  padding: 0px 8px;
`;

const CategoryText = styled.Text<{ selected: boolean }>`
  font-size: 14px;
  font-weight: 300;
  ${(props) => (props.selected ? "white" : "black")}
`;

const ItemView = styled.View`
  margin: 5px 0px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(0, 0, 0, 0.1);
`;

const ItemText = styled(CustomText)`
  font-size: 14px;
  line-height: 21px;
  padding-bottom: 5px;
`;

const EditProfile: React.FC<NativeStackScreenProps<any, "EditProfile">> = ({ route: { params: userData }, navigation: { navigate, setOptions, goBack } }) => {
  const token = useSelector((state) => state.AuthReducers.authToken);

  const [imageURI, setImageURI] = useState<string | null>(userData?.thumbnail);
  /* const [email, setEmail] = useState<string>(userData?.email); */
  const [name, setName] = useState<string>(userData?.name);
  const [sex, setSex] = useState<string>(userData?.sex === "M" ? "남자" : "여자");
  const [birthday, setBirthday] = useState<string>(userData?.birthday);
  const [phoneNumber, setPhoneNumber] = useState<string>(userData?.phoneNumber);
  const [organizationName, setOrganizationName] = useState<string>(userData?.organizationName);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const toast = useToast();

  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const imageHeight = Math.floor(((SCREEN_WIDTH * 0.8) / 4) * 3);

  const mutation = useMutation(UserApi.updateUserInfo, {
    onSuccess: (res) => {
      if (res.status === 200 && res.resultCode === "OK") {
        navigate("Tabs", {
          screen: "Profile",
        });
        toast.show("저장에 성공하였습니다.", {
          type: "success",
        });
      } else {
        console.log(`mutation success but please check status code`);
        console.log(`status: ${res.status}`);
        toast.show("저장에 실패하였습니다.", {
          type: "error",
        });
      }
    },
    onError: (error) => {
      console.log("--- Error ---");
      console.log(`error: ${error}`);
    },
    onSettled: (res, error) => {},
  });

  const onSubmit = () => {
    const data = {
      birthday,
      name,
      organizationName,
      phoneNumber,
    };

    console.log("data : ", data);
    console.log("imageURI : ", imageURI);

    const splitedURI = new String(imageURI).split("/");

    const updateData: UserInfoRequest =
      imageURI === null
        ? {
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
    mutation.mutate(updateData);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.canceled === false) {
      setImageURI(result.assets[0].uri);
    }
  };

  useEffect(() => {
    setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={onSubmit}>
          <Text style={{ color: "#2995FA" }}>저장</Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  useEffect(() => {
    if (phoneNumber.length === 10) {
      setPhoneNumber(phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"));
    }
    if (phoneNumber.length === 12) {
      setPhoneNumber(phoneNumber.replace(/-/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"));
    }
    if (phoneNumber.length === 13) {
      setPhoneNumber(phoneNumber.replace(/-/g, "").replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3"));
    }
  }, [phoneNumber]);

  const [approvalMethod, setApprovalMethod] = useState<number>(0);

  const [categoryItem, setCategoryItem] = useState(false);

  const onClick = () => {
    categoryItem === true ? setCategoryItem(false) : setCategoryItem(true);
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <Container>
        <ImagePickerView>
          <ImagePickerWrap>
            <ImagePickerButton height={imageHeight} onPress={pickImage} activeOpacity={0.8}>
              <PickedImage height={imageHeight} source={{ uri: imageURI }} />
            </ImagePickerButton>
          </ImagePickerWrap>
          <ProfileText onPress={pickImage}>프로필 사진 설정</ProfileText>
        </ImagePickerView>
        <Form>
          <Title>이름</Title>
          <Input autoCorrect={false} placeholder="홍길동" defaultValue={name} onChangeText={(text) => setName(text)} />
        </Form>
        <Form>
          <Title>성별</Title>
          <Input autoCorrect={false} placeholder="남자 or 여자" defaultValue={sex} onChangeText={(text) => setSex(text === "남자" ? "M" : "F")} />
        </Form>
        <Form>
          <Title>생년월일</Title>
          <TextBtn onPress={() => setShowDatePicker((prev) => !prev)} style={{ borderBottomWidth: 1, borderBottomColor: "#cecece" }}>
            <ItemText>{birthday}</ItemText>
          </TextBtn>
          {Platform.OS === "android" ? (
            <Collapsible collapsed={!showDatePicker}>
              <ItemView style={{ width: "100%", alignItems: "center" }}>
                <DatePicker textColor={"#000000"} date={new Date(birthday)} mode="date" onDateChange={(value) => setBirthday(value.toISOString().split("T")[0])} />
              </ItemView>
            </Collapsible>
          ) : (
            <Collapsible collapsed={!showDatePicker}>
              <ItemView>
                <RNDateTimePicker
                  style={{ color: "#fff" }}
                  textColor={"#000000"}
                  mode="date"
                  value={new Date(birthday)}
                  display="spinner"
                  onChange={(_, value: Date) => setBirthday(value.toISOString().split("T")[0])}
                />
              </ItemView>
            </Collapsible>
          )}
        </Form>
        <Form>
          <Title>연락처</Title>
          <Input keyboardType="numeric" placeholder="010-xxxx-xxxx" autoCorrect={false} defaultValue={phoneNumber} onChangeText={(phone) => setPhoneNumber(phone)} maxLength={13} />
        </Form>
        <Form>
          <Title>교회</Title>
          <Input autoCorrect={false} placeholder="시광교회" defaultValue={organizationName} onChangeText={(text) => setOrganizationName(text)} />
        </Form>
        {/* <Form>
          <Title>관심사(3개 이상 택)</Title>
          <CategoryView>
            {interestsKor.map((category, index) => (
              <CategoryItem
                key={index}
                activeOpacity={0.8}
                selected={categoryItem}
                onPress={() => {
                  onClick();
                }}
              >
                <CategoryText selected={categoryItem}>{category}</CategoryText>
              </CategoryItem>
            ))}
          </CategoryView>
        </Form> */}
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default EditProfile;
