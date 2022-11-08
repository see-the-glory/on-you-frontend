import { MaterialCommunityIcons,AntDesign } from "@expo/vector-icons";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView, ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View
} from "react-native";
import styled from "styled-components/native";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { FeedApi,FeedCreationRequest } from "../../api";
import { FeedCreateScreenProps,  } from '../../types/feed';

interface ValueInfo {
  str: string;
  isHT: boolean;
  idxArr: number[];
}

const Container = styled.SafeAreaView`
  flex: 1;
  padding: 0 20px 0 20px;
`;
const ImagePickerView = styled.View`
  width: 100%;
  height: 55%;
  align-items: center;
`;

const PickBackground = styled.ImageBackground`
  width: 100%;
  height: 100%;
  position: absolute;
`;

const ImagePickerButton = styled.TouchableOpacity<{ height: number }>`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: #c4c4c4;
`;

const PickedImage = styled.Image<{ height: number }>`
  width: 100%;
  height: 100%;
`;

const ImageCrop = styled.View`
  background-color: rgba(63, 63, 63, 0.7);
  width: 142px;
  height: 142px;
  border-radius: 100px;
  opacity: 0.5;
  justify-content: center;
  top: 30%;
  left: 30%;
`;

const ImagePickerText = styled.Text`
  font-size: 10px;
  color: white;
  text-align: center;
  padding: 50px 0;
`;

const FeedText = styled.TextInput`
  margin: 13px 15px 15px 30px;
  color: black;
  height: 100px;
`;

const SelectImageView = styled.View`
  background-color: rgba(0, 0, 0, 0.7);
  height: 70px;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 19px 0 19px;
`;
const SelectImageArea = styled.TouchableOpacity``
const SelectImage = styled.Image`
  width: 55px;
  height: 55px;
  margin: 8px;
  background-color: lightgray;
`;

const CancleIcon = styled.View`
  position: relative;
  top: -530%;
  left: 73%;
`;
const FeedCreateArea = styled.View`
  left: 70%;
`

const FeedCreateBtn = styled.TouchableOpacity`

`
const FeedCreateText = styled.Text`
  font-size: 20px;
`
const ImageCancleBtn = styled.TouchableOpacity``
const ImageSelecter: React.FC<FeedCreateScreenProps> = ({
                                                          route:{params:{clubId,userId}},
                                                          navigation: { navigate } }) => {
  const Stack = createNativeStackNavigator();
  const [refreshing, setRefreshing] = useState(false);
  //사진권한 허용
  const [imageURI, setImageURI] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  let [alert, alertSet] = useState(true);

  console.log(userId+'userId')
  console.log(clubId+'clubId')
  console.log(imageURI+'imageURI')

  const getValueInfos = (value: string): ValueInfo[] => {
    if (value.length === 0) {
      return [];
    }
    const splitedArr = value.split(" ");
    let idx = 0;
    return splitedArr.map((str) => {
      const idxArr = [idx, idx + str.length - 1];
      idx += str.length + 1;
      return {
        str,
        isHT: str.startsWith("#") || str.startsWith("@"),
        idxArr,
      };
    });
  };

  //컨텐츠
  const [title, setTitle] = useState<string>("");
  const valueInfos = getValueInfos(title);

  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const imageHeight = Math.floor(((SCREEN_WIDTH * 0.8) / 16) * 9);
  const [postText, setPostText] = useState("");
  const token = useSelector((state:any) => state.AuthReducers.authToken);
  const onText = (text: React.SetStateAction<string>) => setPostText(text);

  const [content, setContent] = useState("")
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageURI(result.uri);
    }
  };
  /*  const pickImage = async () => {
      const result = await MultiImagePicker.openPicker({
        multiple: true,
        allowsEditing: false,
        aspect: [16, 9],
        quality: 1,
        cropping: true
      });
      console.log(result)
    };*/

  const mutation = useMutation(FeedApi.createFeed, {
    onSuccess: (res) => {
      if (res.status === 200 && res.json?.resultCode === "OK") {
        setRefreshing(true);
        return navigate("Tabs", {
          screen: "Home",
          feedData:res.data,
        });
      } else {
        console.log(`mutation success but please check status code`);
        console.log(`status: ${res.status}`);
        console.log(res.json);
        return navigate("Tabs", {
          screen: "Home",
        });
      }
    },
    onError: (error) => {
      console.log("--- Error ---");
      console.log(`error: ${error}`);
      return navigate("Tabs", {
        screen: "Home",
      });
    },
    onSettled: (res, error) => {},
  });

  const onSubmit = () => {
    const data={
      clubId: clubId,
      content: content,
    };

    console.log(data)

    const splitedURI = new String(imageURI).split("/");

    const requestData: FeedCreationRequest =
      imageURI === null
        ? {
          image: null,
          data,
          token,
        }
        : {
          image: {
            uri: imageURI.replace("file://", ""),
            type: "image/jpeg",
            name: splitedURI[splitedURI.length - 1],
          },
          data,
          token,
        };

    mutation.mutate(requestData);
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      alertSet(false);
    }, 3000);
  });

  /**
   * 이미지 리스트 선택하면 사진 크게보는쪽 사진뜨게
   */
  const ImageFIx = () => {};

  /** X선택시 사진 없어지는 태그 */
  const ImageCancle = () => {};

  useEffect(() => {
    return () => setLoading(false);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.select({ios: 'padding', android: undefined})} style={{ flex: 1 }}>
        <Container>
          <>
            <ImagePickerView>
              <ImagePickerButton height={imageHeight} onPress={pickImage} activeOpacity={1}>
                {imageURI ? (
                  // <PickedImage height={imageHeight} source={{ uri: imageURI }} />
                  <PickedImage height={imageHeight} source={{ uri: imageURI }} />
                ) : (
                  <PickBackground>
                    {alert ? (
                      <ImageCrop>
                        <MaterialCommunityIcons name="arrow-top-right-bottom-left" size={30} color="red" style={{ textAlign: "center", top: 40 }} />
                        <ImagePickerText>
                          손가락을 좌우로{"\n"} 동시에 벌려{"\n"} 이미지 크롭을 해보세요
                        </ImagePickerText>
                      </ImageCrop>
                    ) : null}
                  </PickBackground>
                )}
              </ImagePickerButton>
            </ImagePickerView>
            <SelectImageView>
              <SelectImageArea onPress={ImageFIx}>
                <SelectImage source={{ uri: imageURI }} />
                {imageURI === null ? null :
                  <ImageCancleBtn onPress={ImageCancle}>
                    <CancleIcon>
                      <AntDesign name="close" size={12} color="white" />
                    </CancleIcon>
                  </ImageCancleBtn>
                }
              </SelectImageArea>
              <SelectImageArea onPress={ImageFIx}>
                <SelectImage source={{ uri: imageURI }} />
                {imageURI === null ? null :
                  <ImageCancleBtn onPress={ImageCancle}>
                    <CancleIcon>
                      <AntDesign name="close" size={12} color="white" />
                    </CancleIcon>
                  </ImageCancleBtn>
                }
              </SelectImageArea>
              <SelectImageArea onPress={ImageFIx}>
                <SelectImage source={{ uri: imageURI }} />
                {imageURI === null ? null :
                  <ImageCancleBtn onPress={ImageCancle}>
                    <CancleIcon>
                      <AntDesign name="close" size={12} color="white" />
                    </CancleIcon>
                  </ImageCancleBtn>
                }
              </SelectImageArea>
              <SelectImageArea onPress={ImageFIx}>
                <SelectImage source={{ uri: imageURI }} />
                {imageURI === null ? null :
                  <ImageCancleBtn onPress={ImageCancle}>
                    <CancleIcon>
                      <AntDesign name="close" size={12} color="white" />
                    </CancleIcon>
                  </ImageCancleBtn>
                }
              </SelectImageArea>
              <SelectImageArea onPress={ImageFIx}>
                <SelectImage source={{ uri: imageURI }} />
                {imageURI === null ? null :
                  <ImageCancleBtn onPress={ImageCancle}>
                    <CancleIcon>
                      <AntDesign name="close" size={12} color="white" />
                    </CancleIcon>
                  </ImageCancleBtn>
                }
              </SelectImageArea>
            </SelectImageView>
            <FeedText
              placeholder="사진과 함께 남길 게시글을 작성해 보세요."
              onChangeText={(content) => setContent(content)}
              autoCompleteType="off"
              autoCapitalize="none"
              autoCorrect={false}
              multiline={true}
              returnKeyType="done"
              returnKeyLabel="done"
            >
              {valueInfos.map(({ str, isHT, idxArr }, idx) => {
                const [firstIdx, lastIdx] = idxArr;
                let value = title.slice(firstIdx, lastIdx + 1);
                const isLast = idx === valueInfos.length - 1;
                if (isHT) {
                  return (
                    <Text style={{ color: "skyblue", backgroundColor: "transparent" }}>
                      {value}
                      {!isLast && <Text style={{ backgroundColor: "transparent" }}> </Text>}
                    </Text>
                  );
                }
                return (
                  <Text style={{ color: "black" }}>
                    {value}
                    {!isLast && <Text> </Text>}
                  </Text>
                );
              })}
            </FeedText>
            <FeedCreateArea>
              <FeedCreateBtn onPress={onSubmit}>
                <FeedCreateText>저장</FeedCreateText>
              </FeedCreateBtn>
            </FeedCreateArea>
          </>
        </Container>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default ImageSelecter;