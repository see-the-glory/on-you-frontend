import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  DeviceEventEmitter,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import styled from "styled-components/native";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { FeedApi, FeedCreationRequest, FeedsResponse } from "../../api";
import { FeedCreateScreenProps } from "../../types/feed";
import { useNavigation } from "@react-navigation/native";
import CustomText from "../../components/CustomText";
import { PinchGestureHandler, State } from "react-native-gesture-handler";
import { RootState } from "../../redux/store/reducers";

interface ValueInfo {
  str: string;
  isHT: boolean;
  idxArr: number[];
}

const Container = styled.SafeAreaView`
  flex: 1;
`;
const ImagePickerView = styled.View`
  width: 100%;
  height: ${Platform.OS === "android" ? 60 : 65}%;
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
  color: black;
  height: ${Platform.OS === "ios" ? 90 : 100}px;
  margin: 0 15px 0 15px;
  top: ${Platform.OS === "ios" ? 5 : 0}%;
`;

const SelectImageView = styled.View`
  background-color: rgba(0, 0, 0, 0.7);
  height: 70px;
  width: 100%;
  flex-direction: row;
  justify-content: space-around;
`;

const SelectImageArea = styled.TouchableOpacity``;
const SelectImage = styled.Image`
  width: 55px;
  height: 55px;
  margin: 8px;
  background-color: lightgray;
`;

const ImageCancleBtn = styled.TouchableOpacity``;
const CancleIcon = styled.View`
  width: 20%;
  position: absolute;
  right: 12%;
  bottom: 50px;
`;

const FeedCreateBtn = styled.TouchableOpacity``;
const FeedCreateText = styled(CustomText)`
  font-size: 18px;
  color: #63abff;
  font-weight: bold;
  padding: 10px;
`;

const ImageSource = styled.Image<{ size: number }>`
  width: 100%;
  height: ${Platform.OS === "android" ? 100 : 100}%;
`;

function ImageSelecter(props: FeedCreateScreenProps) {
  let {
    route: {
      params: { clubId, userId },
    },
    navigation: { navigate },
  } = props;
  const Stack = createNativeStackNavigator();
  const [refreshing, setRefreshing] = useState(false);
  //사진권한 허용
  const [imageURI, setImageURI] = useState<any>("");
  const [choiceImage, setChoiceImage] = useState();
  const [loading, setLoading] = useState(false);
  // const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [alert, alertSet] = useState(true);
  const [response, setResponse] = useState(null);
  const [isSubmitShow, setSubmitShow] = useState(true);
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
  const token = useSelector((state: RootState) => state.auth.token);
  const [content, setContent] = useState("");
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [imageLength, setImageLength] = useState(0);
  const [feedImageLength, setFeedImageLength] = useState<any>(0);

  const pickImage = async () => {
    //사진허용
    /*    if(!status?.granted){
          const permission=await requestPermission();
          if(!permission.granted){
            return null;
          }
        }*/

    let result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      aspect: [16, 9],
      allowsMultipleSelection: true,
      selectionLimit: 5,
    });

    let array = [];
    for (let i = 0; i < result?.assets?.length; i++) {
      if (!result.canceled) {
        array.push(result.assets[i].uri);
        // setImageURI(result.assets[i].uri);
      }
    }
    setImageURI(array);
    setFeedImageLength(array.length);
  };
  console.log(imageURI);

  const { isLoading: feedsLoading, data: feeds, isRefetching: isRefetchingFeeds } = useQuery<FeedsResponse>(["getFeeds", { token }], FeedApi.getFeeds, {});

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries(["getFeeds"]);
    setRefreshing(false);
  };

  const mutation = useMutation(FeedApi.createFeed, {
    onSuccess: (res) => {
      if (res.status === 200 && res.resultCode === "OK") {
        DeviceEventEmitter.emit("HomeFeedRefetch");
        navigate("Tabs", {
          screen: "Home",
        });
      } else {
        console.log(`mutation success but please check status code`);
        console.log(`status: ${res.status}`);
      }
    },
    onError: (error) => {
      console.log("--- Error ---");
      console.log(`error: ${error}`);
    },
    onSettled: (res, error) => {},
  });

  const onSubmit = () => {
    if (imageURI.length == 0) {
      Alert.alert("이미지를 선택하세요");
    } else if (content.length == 0) {
      Alert.alert("글을 작성하세요");
    } else {
      setSubmitShow(false);
      const data = {
        clubId: clubId,
        content: content,
      };

      let requestData: FeedCreationRequest = {
        image: [],
        data,
        token,
      };
      if (imageURI.length == 0) requestData.image = null;

      for (let i = 0; i < imageURI.length; i++) {
        const splitedURI = String(imageURI[i]).split("/");
        if (requestData.image) {
          requestData.image.push({
            uri: Platform.OS === "android" ? imageURI[i] : imageURI[i].replace("file://", ""),
            type: "image/jpeg",
            name: splitedURI[splitedURI.length - 1],
          });
        }
      }
      mutation.mutate(requestData);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            onSubmit();
          }}
        >
          {isSubmitShow ? <FeedCreateText>저장</FeedCreateText> : <ActivityIndicator />}
        </TouchableOpacity>
      ),
    });
  }, [imageURI, content, isSubmitShow]);

  useEffect(() => {
    let timer = setTimeout(() => {
      alertSet(false);
    }, 3000);
  });

  /**
   * 이미지 리스트 선택하면 사진 크게보는쪽 사진뜨게
   */
  const ImageFIx = (i: any) => {
    setChoiceImage(imageURI[i]);
  };

  /** X선택시 사진 없어지는 태그 */
  const ImageCancle = (q: any) => {
    console.log("imageCancle");
  };

  /*이미지 선택영역**/
  const imagePreview = [];
  for (let i = 0; i < imageURI.length; i += 1) {
    imagePreview.push(
      <SelectImageArea key={i} onPress={() => ImageFIx(i)}>
        <SelectImage source={{ uri: imageURI[i] }} />
        {imageURI === null ? null : (
          <ImageCancleBtn onPress={() => ImageCancle(i)}>
            <CancleIcon>
              <AntDesign name="close" size={15} color="white" />
            </CancleIcon>
          </ImageCancleBtn>
        )}
      </SelectImageArea>
    );
  }

  /*이미지 큰영역**/
  const imageChoice = [];
  const imageList = [];
  for (let i = 0; i < imageURI.length; i++) {
    imageList.push({ img: imageURI[i] }); //슬라이더용
  }
  /*  imageChoice.push(
      <ImageSource source={{uri: choiceImage}} size={400}/> //기본사진용
        <ImageSlider data={imageList} preview={false} caroselImageStyle={{ resizeMode: "stretch", height: 420 }}
                 indicatorContainerStyle={{ bottom: 0 }}
    />
    );*/
  // console.log(choiceImage)
  // console.log(imageList)
  const { width } = Dimensions.get("window");
  const scale = new Animated.Value(1);

  const onZoomEvent = Animated.event(
    [
      {
        nativeEvent: { scale: scale },
      },
    ],
    {
      useNativeDriver: true,
    }
  );

  const onZoomStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <Container>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "position" : "padding"} style={{ flex: 1 }}>
          <>
            <ImagePickerView>
              {Object.keys(imageURI).length !== 0 ? (
                <PinchGestureHandler onGestureEvent={onZoomEvent} onHandlerStateChange={onZoomStateChange}>
                  <Animated.Image
                    source={{ uri: choiceImage }}
                    style={{
                      width: width,
                      height: 380,
                      transform: [{ scale: scale }],
                    }}
                  />
                </PinchGestureHandler>
              ) : (
                <ImagePickerButton height={imageHeight} onPress={pickImage} activeOpacity={1}>
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
                </ImagePickerButton>
              )}
            </ImagePickerView>
            <SelectImageView>
              <View style={{ display: "flex", flexDirection: "row" }}>{imagePreview}</View>
            </SelectImageView>
            <FeedText
              placeholder="사진과 함께 남길 게시글을 작성해 보세요."
              onChangeText={(content: any) => setContent(content)}
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
                    <Text style={{ color: "skyblue", backgroundColor: "black" }}>
                      {value}
                      {!isLast && <Text style={{ backgroundColor: "pink" }}> </Text>}
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
          </>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Container>
  );
}

export default ImageSelecter;
