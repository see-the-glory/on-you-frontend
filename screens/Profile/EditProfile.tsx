import React, { useState, useEffect, useRef } from "react";
import { TouchableOpacity, Text, NativeModules, Alert } from "react-native";
import { Keyboard, TouchableWithoutFeedback, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import * as ImagePicker from "expo-image-picker";
import { useMutation, useQuery } from "react-query";
import { useSelector, useDispatch } from "react-redux";
import { UserApi, UserInfoRequest, User, Category, ClubApi, CategoryResponse } from "../../api";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { EditProfileScreenProps } from "../../Types/User";
import { NavigationRouteContext } from "@react-navigation/native";

Date.prototype.format = function (f) {
  if (!this.valueOf()) return " ";

  var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  var d = this;

  return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function ($1) {
    switch ($1) {
      case "yyyy":
        return d.getFullYear();
      case "yy":
        return (d.getFullYear() % 1000).zf(2);
      case "MM":
        return (d.getMonth() + 1).zf(2);
      case "dd":
        return d.getDate().zf(2);
      case "E":
        return weekName[d.getDay()];
      case "HH":
        return d.getHours().zf(2);
      case "hh":
        return ((h = d.getHours() % 12) ? h : 12).zf(2);
      case "mm":
        return d.getMinutes().zf(2);
      case "ss":
        return d.getSeconds().zf(2);
      case "a/p":
        return d.getHours() < 12 ? "오전" : "오후";
      default:
        return $1;
    }
  });
};

String.prototype.string = function (len) {
  var s = "",
    i = 0;
  while (i++ < len) {
    s += this;
  }
  return s;
};
String.prototype.zf = function (len) {
  return "0".string(len - this.length) + this;
};
Number.prototype.zf = function (len) {
  return this.toString().zf(len);
};

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

const Title = styled.Text`
  color: #b0b0b0;
  font-size: 10px;
  margin-bottom: 10px;
`;

const Input = styled.TextInput`
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

const EditProfile: React.FC<EditProfileScreenProps> = ({ route: { params: userData }, navigation: { navigate, setOptions, goBack } }) => {
  const token = useSelector((state) => state.AuthReducers.authToken);

  const interestsEng = ["READING", "GODLY", "VOLUNTEER", "EXERCISE", "CULTURE", "GAME", "CREATURE", "DEVELOPMENT", "FOOD", "TRAVEL", "PET", "ETC"];
  const interestsKor = ["📚 독서", "🙏 경건생활", "💗 봉사", "⚽ 운동", "🎈 문화생활", "🎲 게임", "💡 창작", "📂 자기개발", "🍕 음식", "🏝 여행", "🐼 반려동물", "🔍 기타"];

  const [thumbnail, setThumbnail] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sex, setSex] = useState("");
  const [birthday, setBirthday] = useState("");
  const [phone, setPhone] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [interests, setInterests] = useState("");

  const mutation = useMutation(UserApi.updateUserInfo, {
    onSuccess: (res) => {
      if (res.status === 200 && res.json?.resultCode === "OK") {
        return goBack();
      } else {
        console.log(`mutation success but please check status code`);
        console.log(`status: ${res.status}`);
        console.log(res.json);
      }
    },
    onError: (error) => {
      console.log("--- Error ---");
      console.log(`error: ${error}`);
    },
    onSettled: (res, error) => {},
  });

  const onSubmit = () => {
    const data = { /* phone, */ name, birthday, email /* thumbnail, organizationName, interests */ };

    console.log(data);

    const requestData: UserInfoRequest = { data, token };

    mutation.mutate(requestData);
  };

  useEffect(() => {
    setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigate("Tabs", { screen: "Profile" })} onPressIn={onSubmit}>
          <Text style={{ color: "#2995FA" }}>저장</Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  useEffect(() => {
    if (phone.length === 10) {
      setPhone(phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"));
    }
    if (phone.length === 12) {
      setPhone(phone.replace(/-/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"));
    }
    if (phone.length === 13) {
      setPhone(phone.replace(/-/g, "").replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3"));
    }
  }, [phone]);

  const [imageURI, setImageURI] = useState<string | null>(null);

  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const imageHeight = Math.floor(((SCREEN_WIDTH * 0.8) / 4) * 3);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [16, 9],
      quality: 1,
    });

    if (result.cancelled === false) {
      setImageURI(result.uri);
    }
  };

  const placeholder = "날짜를 입력해주세요";

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [text, onChangeText] = useState("");

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn("dateFormat: ", date.format("yyyy/MM/dd"));
    hideDatePicker();
    onChangeText(date.format("yyyy/MM/dd"));
  };

  const [approvalMethod, setApprovalMethod] = useState<number>(0);

  const [categoryItem, setCategoryItem] = useState(false);

  const isCategorySelect = Array(interestsKor.length).fill(false);

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
              <PickedImage
                height={imageHeight}
                source={{ uri: userData.thumbnail === null ? "http://k.kakaocdn.net/dn/dpk9l1/btqmGhA2lKL/Oz0wDuJn1YV2DIn92f6DVK/img_110x110.jpg" : userData.thumbnail }}
              />
            </ImagePickerButton>
          </ImagePickerWrap>
          <ProfileText onPress={pickImage}>프로필 사진 설정</ProfileText>
        </ImagePickerView>
        <Form>
          <Title>이름</Title>
          <Input autoCorrect={false} placeholder="이정규" defaultValue={userData.name} onChangeText={(text) => setName(text)} />
        </Form>
        <Form>
          <Title>성별</Title>
          <Input autoCorrect={false} placeholder="남자" defaultValue={userData.sex === "M" ? "남자" : "여자"} onChangeText={(text) => setSex(text)} />
          {/* <FieldContentView>
            <FieldContentLine>
              <Button onPress={() => setApprovalMethod(0)} activeOpacity={0.5}>
                {approvalMethod ? <MaterialCommunityIcons name="radiobox-blank" size={20} color="#E8E8E8" /> : <MaterialCommunityIcons name="radiobox-marked" size={20} color="#ff714b" />}
                <FieldContentText> 남자</FieldContentText>
              </Button>
            </FieldContentLine>
            <FieldContentLine>
              <Button onPress={() => setApprovalMethod(1)} activeOpacity={0.5}>
                {approvalMethod ? <MaterialCommunityIcons name="radiobox-marked" size={20} color="#ff714b" /> : <MaterialCommunityIcons name="radiobox-blank" size={20} color="#E8E8E8" />}
                <FieldContentText> 여자</FieldContentText>
              </Button>
            </FieldContentLine>
          </FieldContentView> */}
        </Form>
        <Form>
          <Title>생년월일</Title>
          <TextBtn onPress={showDatePicker}>
            <Input
              pointerEvents="none"
              placeholder="yyyy/MM/dd"
              placeholderTextColor="#000000"
              underlineColorAndroid="transparent"
              editable={false}
              defaultValue={userData.birthday}
              onChangeText={(text) => setBirthday(text)}
            />
          </TextBtn>
        </Form>
        <Form>
          <Title>연락처</Title>
          <Input keyboardType="numeric" placeholder="010-xxxx-xxxx" autoCorrect={false} defaultValue={userData.phoneNumber} onChangeText={(phone) => setPhone(phone)} maxLength={13} />
        </Form>
        <Form>
          <Title>교회</Title>
          <Input autoCorrect={false} placeholder="시광교회" defaultValue={userData.organizationName} onChangeText={(text) => setOrganizationName(text)} />
        </Form>
        <Form>
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
        </Form>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default EditProfile;
