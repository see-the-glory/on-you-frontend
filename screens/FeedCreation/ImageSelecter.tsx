import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { AntDesign, Octicons } from "@expo/vector-icons";
import ImagePicker from "react-native-image-crop-picker";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  DeviceEventEmitter,
  Keyboard,
  KeyboardAvoidingView,
  Platform, ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import styled from "styled-components/native";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { BaseResponse, ErrorResponse, FeedApi, FeedCreationRequest } from "../../api";
import { FeedCreateScreenProps } from "../../types/feed";
import { useNavigation } from "@react-navigation/native";
import { RootState } from "../../redux/store/reducers";
import { useToast } from "react-native-toast-notifications";
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist";
import CustomTextInput from "../../components/CustomTextInput";

const Container = styled.SafeAreaView`
  flex: 1;
`;
const ImagePickerView = styled.View`
  width: 100%;
  height: 62%;
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
  width: 150px;
  height: 150px;
  border-radius: 100px;
  opacity: 0.5;
  justify-content: center;
  top: 30%;
  left: 30%;
`;

const ImagePickerText = styled.Text`
  font-size: 14px;
  color: white;
  text-align: center;
  padding: 30px 0;
  top: 8px;
`;

const FeedTextArea = styled.View`
  padding: 10px 20px 0 20px;
`

const FeedText = styled(CustomTextInput)`
  width: 100%;
  color: black; 
  height: 250px;
  top: ${Platform.OS === "ios" ? 2 : 0}%;
  font-size: 15px;
`;

const SelectImageView = styled.View`
  background-color: #f5f5f5;
  height: 100px;
  width: 100%;
  flex-direction: column;
  justify-content: space-around;
  padding: 15px 20px 10px 20px;
`;

const MyImage = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const MoreImageArea = styled.View`
  width: 55px;
  height: 55px;
  margin: 8px;
  background-color: #ececec;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImagePlusBtn = styled.Text`
  color: #aaaaaa;
  font-size: 55px;
  font-weight: 100;
  line-height: 59px;
`;

const ImageUnderArea = styled.View`
  justify-content: flex-start;
  flex-direction: row;
  padding-top: 15px;
`;

const MoveImageText = styled.Text`
  color: #979797;
  font-size: 13px;
  padding: 5px 0 5px 0;
`;

const SelectImageArea = styled.TouchableOpacity``;
const SelectImage = styled.Image`
  width: 55px;
  height: 55px;
  margin: 8px;
  background-color: lightgray;
`;

const CancelIcon = styled.TouchableOpacity`
  width: 20%;
  position: absolute;
  right: 12%;
  bottom: 48px;
`;

const FeedCreateText = styled.Text`
  font-size: 14px;
  color: #63abff;
  line-height: 20px;
  padding-top: 5px;
`;

const ImageSelecter = (props: FeedCreateScreenProps) => {
  let {
    route: {
      params: { clubId, userId },
    },
    navigation: { navigate, goBack },
  } = props;
  const token = useSelector((state: RootState) => state.auth.token);
  const toast = useToast();
  const [imageURL, setImageURL] = useState<string[]>([]);
  const [selectIndex, setSelectIndex] = useState<number>();
  const [isSubmitShow, setSubmitShow] = useState(true);

  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const [content, setContent] = useState("");
  const navigation = useNavigation();

  const [buttonClicked, setButtonClicked] = useState(false);

  // useEffect(() => {
  //   pickImage();
  // }, []);

  const pickImage = async () => {
    try {
      let images = await ImagePicker.openPicker({
        mediaType: "photo",
        multiple: true,
        minFiles: 1,
        maxFiles: 5,
      });

      if (images?.length > 5) {
        toast.show(`이미지는 5개까지 선택할 수 있습니다.`, {
          type: "warning",
        });
        return;
      }

      let url = [];
      for (let i = 0; i < images.length; i++) {
        let croped = await ImagePicker.openCropper({
          mediaType: "photo",
          path: images[i].path,
          width: 1080,
          height: 1080,
          cropperCancelText: "Cancel",
          cropperChooseText: "Check",
          cropperToolbarTitle: "이미지를 크롭하세요",
          forceJpg: true,
        });
        url.push(croped.path);
      }
      setSelectIndex(url?.length > 0 ? 0 : undefined);
      setImageURL(url);
    } catch (e) {}
  };

  const morePickImage = async () => {
    try {
      let newImages = await ImagePicker.openPicker({
        mediaType: "photo",
        multiple: true,
        minFiles: 1,
        maxFiles: 5,
      });

      if (imageURL.length + newImages.length > 5) {
        toast.show(`이미지는 5개까지 선택할 수 있습니다.`, {
          type: "warning",
        });
        return;
      }

      let url: any[] = [];
      for (let i = 0; i < newImages.length; i++) {
        let croped = await ImagePicker.openCropper({
          mediaType: "photo",
          path: newImages[i].path,
          width: 1080,
          height: 1080,
          cropperCancelText: "Cancel",
          cropperChooseText: "Check",
          cropperToolbarTitle: "이미지를 크롭하세요",
          forceJpg: true,
        });

        if (imageURL.length > 5) {
          toast.show(`이미지는 5개까지 선택할 수 있습니다.`, {
            type: "warning",
          });
          return;
        }
        url.push(croped.path);
      }
      setSelectIndex(url?.length > 0 ? 0 : undefined);
      setImageURL((prev) => [...prev, ...url]);
    } catch (e) {}
  };

  const mutation = useMutation<BaseResponse, ErrorResponse, FeedCreationRequest>(FeedApi.createFeed, {
    onSuccess: (res) => {
      setSubmitShow(true);
      DeviceEventEmitter.emit("HomeAllRefetch");
      navigate("Tabs", { screen: "Home" });
    },
    onError: (error) => {
      setSubmitShow(true);
      console.log(`API ERROR | createFeed ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  const onSubmit = () => {
    if (imageURL.length == 0) {
      Alert.alert("이미지를 선택하세요");
    } else if (content.length == 0) {
      Alert.alert("글을 작성하세요");
    } else {
      setSubmitShow(false);
      setButtonClicked(true);
      const data = {
        clubId: clubId,
        content: content.trim(),
      };

      let requestData: FeedCreationRequest = {
        image: [],
        data,
      };
      if (imageURL.length == 0) requestData.image = null;

      for (let i = 0; i < imageURL.length; i++) {
        const splitedURI = String(imageURL[i]).split("/");
        if (requestData.image) {
          requestData.image.push({
            uri: Platform.OS === "android" ? imageURL[i] : imageURL[i].replace("file://", ""),
            type: "image/jpeg",
            name: splitedURI[splitedURI.length - 1],
          });
        }
      }
      mutation.mutate(requestData);
    }
  };

  const cancelCreate = () => {
    Alert.alert(
      "게시글을 생성을 취소하시겠어요?",
      "",
      // "30일 이내에 내 활동의 최근 삭제 항목에서 이 게시물을 복원할 수 있습니다." + "30일이 지나면 영구 삭제 됩니다. ",
      [
        {
          text: "아니요",
          onPress: () => console.log(""),
          style: "cancel",
        },
        { text: "네", onPress: () => goBack() },
      ],
      { cancelable: false }
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={cancelCreate}>
          <Octicons name="x" size={24} style={{ top: 5 }} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () =>
        isSubmitShow ? (
          <TouchableOpacity disabled={buttonClicked} onPress={onSubmit}>
            <FeedCreateText>저장</FeedCreateText>
          </TouchableOpacity>
        ) : (
          <ActivityIndicator />
        ),
    });
  }, [imageURL, content, isSubmitShow]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      goBack();
      return true;
    });

    return () => {
      backHandler.remove();
    };
  }, []);

  /** X선택시 사진 없어지는 태그 */
  const ImageCancel = (q: any) => {
    setImageURL((prev: string[]) => prev.filter((_, index) => index != q));
    if (selectIndex == q) setSelectIndex(0);
  };

  const moreImageFix = async (imageURL: string[], index?: number) => {
    if (index === undefined) return;
    try {
      let croped = await ImagePicker.openCropper({
        mediaType: "photo",
        path: imageURL[index],
        width: 1080,
        height: 1080,
        cropperCancelText: "Cancel",
        cropperChooseText: "Check",
        cropperToolbarTitle: "이미지를 크롭하세요",
      });
      setImageURL((prev) => {
        prev[index] = croped.path;
        return prev;
      });
    } catch (e) {}
  };

  const renderItem = useCallback(
    ({ drag, isActive, item, getIndex }: RenderItemParams<string>) => {
      return (
        <ScaleDecorator>
          <TouchableOpacity
            activeOpacity={1}
            onLongPress={drag}
            disabled={isActive}
            onPress={() => moreImageFix(imageURL, getIndex())}
            key={item}
            style={[
              {
                opacity: isActive ? 0.5 : 1,
              },
            ]}
          >
            <SelectImage source={{ uri: item }} />
            <CancelIcon onPress={() => ImageCancel(imageURL.indexOf(item))}>
              <AntDesign name="close" size={15} color="white" />
            </CancelIcon>
          </TouchableOpacity>
        </ScaleDecorator>
      );
    },
    [imageURL]
  );

  return (
    <Container>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView>
          <SelectImageView>
            <MyImage>
              <DraggableFlatList horizontal data={imageURL} onDragEnd={({ data }) => setImageURL(data)} keyExtractor={(item) => item} renderItem={(props) => renderItem({ ...props })} />
              {imageURL.length < 5 ? (
                <TouchableOpacity onPress={morePickImage}>
                  <MoreImageArea>
                    <ImagePlusBtn>+</ImagePlusBtn>
                  </MoreImageArea>
                </TouchableOpacity>
              ) : null}
            </MyImage>
            <ImageUnderArea>
              <MoveImageText>사진을 길게 눌러 순서를 변경할 수 있습니다.</MoveImageText>
            </ImageUnderArea>
          </SelectImageView>
          <FeedTextArea>
            <FeedText
                value={content}
                placeholder="사진과 함께 남길 게시글을 작성해 보세요."
                onChangeText={(content: string) => setContent(content)}
                onEndEditing={() => setContent((prev) => prev.trim())}
                autoCapitalize="none"
                autoCorrect={false}
                multiline={true}
                includeFontPadding={false}
                textAlignVertical="top"
            />
          </FeedTextArea>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default ImageSelecter;
