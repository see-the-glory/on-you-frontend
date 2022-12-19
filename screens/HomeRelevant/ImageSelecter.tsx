import { MaterialCommunityIcons,AntDesign } from "@expo/vector-icons";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from 'expo-permissions';
import React, { useEffect, useState } from "react";
import {
  Alert, Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView, ScrollView, StatusBar, StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View
} from "react-native";
import styled from "styled-components/native";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { FeedApi, FeedCreationRequest, FeedsResponse } from "../../api";
import { FeedCreateScreenProps,  } from '../../types/feed';
// @ts-ignore
import { ImageBrowser } from "expo-image-picker-multiple";
import { useNavigation } from "@react-navigation/native";
import { ImageSlider } from "react-native-image-slider-banner";
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
  height: ${Platform.OS === 'android' ? 62 : 65}%;
  align-items: center;
  top: ${Platform.OS === 'android' ? 3 : 0}%;
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
  justify-content: space-around;
  padding: 0;
`;

const SelectImageArea = styled.TouchableOpacity`
`
const SelectImage = styled.Image`
  width: 55px;
  height: 55px;
  margin: 8px;
  background-color: lightgray;
`;

const ImageCancleBtn = styled.TouchableOpacity`
`
const CancleIcon = styled.View`
  width: 20%;
  position: absolute;
  right: 12%;
  bottom: 50px;
`;
const FeedCreateArea = styled.View`
  left: 70%;
`

const FeedCreateBtn = styled.TouchableOpacity`
`
const FeedCreateText = styled.Text`
  font-size: 20px;
  color: #63abff;
  font-weight: bold;
  padding: 10px;
`

const ImageSelecter: React.FC<FeedCreateScreenProps> = ({
                                                          route:{params:{clubId,userId}},
                                                          navigation: { navigate } }) => {
  const Stack = createNativeStackNavigator();
  const [refreshing, setRefreshing] = useState(false);
  //사진권한 허용
  const [imageURI, setImageURI] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [alert, alertSet] = useState(true);

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
  const token = useSelector((state:any) => state.AuthReducers.authToken);
  const [content, setContent] = useState("")
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [imageLength, setImageLength] = useState(0)
  const [feedImageLength, setFeedImageLength] = useState<any>(0);
  const pickImage = async () => {
    //사진허용
    /*    if(!status?.granted){
          const permission=await requestPermission();
          if(!permission.granted){
            return null;
          }
        }*/

    let result:any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
      aspect: [16,9],
      allowsMultipleSelection: true,
      selectionLimit: 5,
    });

    let array = [];
    for(let i=0; i<result?.assets?.length; i++){
      if (!result.canceled) {
        array.push(result.assets[i].uri);
        // setImageURI(result.assets[i].uri);
      }
    }
    setImageURI(array);
    setFeedImageLength(array.length)
  };
  // console.log(imageURI.toString())

  const {
    isLoading: feedsLoading,
    data: feeds,
    isRefetching: isRefetchingFeeds,
  } = useQuery<FeedsResponse>(["getFeeds", {token}], FeedApi.getFeeds, {});

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries(["getFeeds"]);
    setRefreshing(false);
  };

  const mutation = useMutation(FeedApi.createFeed, {
    onSuccess: (res) => {
      if (res.status === 200 && res.json?.resultCode === "OK") {
        navigate("Tabs", {
          screen: "Home",
          feedData:res.data,
        });
        onRefresh();
      }
      else {
        console.log(`mutation success but please check status code`);
        console.log(`status: ${res.status}`);
        console.log(res.json+'json');
        /*        return navigate("Tabs", {
                  screen: "Home",
                });*/
      }
    },
    onError: (error) => {
      console.log("--- Error ---");
      console.log(`error: ${error}`);
    },
    onSettled: (res, error) => {},
  });

 const onSubmit = () => {
    const data={
      clubId: clubId,
      content: content,
    };

    const splitedURI = String(imageURI).split("/");
    for(let i=0; i<imageURI.length; i++){
      const requestData: FeedCreationRequest =
        imageURI.length === 0
          ? {
            image: null,
            data,
            token,
          }
          : {
            image: {
              uri: imageURI[i].replace("file://", ""),
              type: "image/jpeg",
              name: splitedURI[splitedURI.length - 1],
            },
            data,
            token,
          };
      mutation.mutate(requestData);
      onRefresh();
    }
  };

  useEffect(()=>{
    navigation.setOptions({
      headerRight: () => <TouchableOpacity onPress={onSubmit}><FeedCreateText>저장</FeedCreateText></TouchableOpacity>
    })
  },[navigation, onSubmit]);

  useEffect(() => {
    let timer = setTimeout(() => {
      alertSet(false);
    }, 3000);
  });

  /**
   * 이미지 리스트 선택하면 사진 크게보는쪽 사진뜨게
   */
  const ImageFIx = (i:any) => {
    console.log('imageFix')
    return (
      <View key={i}>
        <ImageSlider
          data={[{img: imageURI[i]}]}
          preview={false}
          caroselImageStyle={{ resizeMode: "stretch",height: 420 }}
          indicatorContainerStyle={{ bottom: 0 }}
        />
      </View>
    )
  };

  /** X선택시 사진 없어지는 태그 */
  const ImageCancle = () => {
    if(imageURI.length>0){
      setImageURI('')
      console.log('imageCancle')
    }
  };

  /*이미지 선택영역**/
  const imagePreview = [];
  for (let i = 0; i < imageURI.length; i += 1) {
    imagePreview.push(
      <SelectImageArea key={i} onPress={ImageFIx}>
        <SelectImage source={{ uri: imageURI[i]}} onPress={()=>ImageFIx(i)}/>
        {imageURI === null ? null :
          <ImageCancleBtn>
            <CancleIcon onPress={ImageCancle}>
              <AntDesign name="close" size={15} color="white" />
            </CancleIcon>
          </ImageCancleBtn>
        }
      </SelectImageArea>
    );
  }


  /*이미지 큰영역**/
  const imageChoice = [];
  const imageList=[];
  for (let i = 0; i < imageURI.length; i++) {
    imageList.push({img:imageURI[i]});
  }
  imageChoice.push(
    <ImageSlider
      data={imageList}
      preview={false}
      caroselImageStyle={{ resizeMode: "stretch",height: 420 }}
      indicatorContainerStyle={{ bottom: 0 }}
    />
  );

  return (
    <Container>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.select({ios: 'position', android: 'padding'})} style={{ flex: 1 }}>
          <>
            <ImagePickerView>
              {Object.keys(imageURI).length !== 0 ? (
                <View>
                  {imageChoice}
                </View>
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
            {/* <SelectImage source={{ uri: imageURI.assets[0].uri}} />*/}
            <SelectImageView>
              <View style={{display:'flex', flexDirection:'row'}}>
                {imagePreview}
              </View>
            </SelectImageView>
            <FeedText
              placeholder="사진과 함께 남길 게시글을 작성해 보세요."
              onChangeText={(content:any) => setContent(content)}
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
};

export default ImageSelecter;
