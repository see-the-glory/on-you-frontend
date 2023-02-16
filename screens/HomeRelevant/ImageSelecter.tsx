import React, { useCallback, useEffect, useState } from "react";
import { AntDesign, Entypo } from "@expo/vector-icons";
import ImagePicker from "react-native-image-crop-picker";
import { ActivityIndicator, Alert, DeviceEventEmitter, Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { FeedApi, FeedCreationRequest } from "../../api";
import { FeedCreateScreenProps } from "../../types/feed";
import { useNavigation } from "@react-navigation/native";
import { RootState } from "../../redux/store/reducers";
import { useToast } from "react-native-toast-notifications";
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist";

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

const FeedText = styled.TextInput`
  color: black;
  height: ${Platform.OS === "ios" ? 90 : 100}px;
  padding: 0 20px 0 20px;
  top: ${Platform.OS === "ios" ? 2 : 0}%;
  font-size: 15px;
`;

const SelectImageView = styled.View`
  background-color: #f2f2f2;
  height: 100px;
  width: 100%;
  flex-direction: column;
  justify-content: space-around;
  padding: 10px 20px 10px 20px;
`;

const MyImage = styled.View`
  align-items: center;
`;

const MoveImageText = styled.Text`
  color: #979797;
  font-size: 13px;
  padding: 5px 0 5px 0;
`;

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
    navigation: { navigate },
  } = props;
  const token = useSelector((state: RootState) => state.auth.token);
  const toast = useToast();
  const [imageURL, setImageURL] = useState<string[]>([]);
  const [selectIndex, setSelectIndex] = useState<number>();
  const [alert, alertSet] = useState(true);
  const [isSubmitShow, setSubmitShow] = useState(true);

  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const imageHeight = Math.floor(((SCREEN_WIDTH * 0.8) / 16) * 9);
  const [content, setContent] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    pickImage();
  }, []);

  const pickImage = async () => {
    let images = await ImagePicker.openPicker({
      mediaType: "photo",
      multiple: true,
      height: 1080,
      width: 1080,
      minFiles: 1,
      maxFiles: 5,
      cropperCancelText: "Cancle",
      cropperChooseText: "Check",
    });

    if (images.length > 5) {
      toast.show(`이미지는 3개까지 선택할 수 있습니다.`, {
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
      });
      url.push(croped.path);
    }
    setSelectIndex(url?.length > 0 ? 0 : undefined);
    setImageURL(url);
  };

  const mutation = useMutation(FeedApi.createFeed, {
    onSuccess: (res) => {
      setSubmitShow(true);
      if (res.status === 200) {
        DeviceEventEmitter.emit("HomeFeedRefetch");
        navigate("Tabs", {
          screen: "Home",
        });
      } else {
        console.log(`createFeed mutation success but please check status code`);
        console.log(`status: ${res.status}`);
        toast.show(`createFeed Error (Code): ${res.status}`, {
          type: "warning",
        });
      }
    },
    onError: (error) => {
      setSubmitShow(true);
      console.log("--- Error ---");
      console.log(`error: ${error}`);
      toast.show(`createFeed Error (Code): ${error}`, {
        type: "warning",
      });
    },
    onSettled: (res, error) => {},
  });

  const onSubmit = () => {
    if (imageURL.length == 0) {
      Alert.alert("이미지를 선택하세요");
    } else if (content.length == 0) {
      Alert.alert("글을 작성하세요");
    } else {
      setSubmitShow(false);
      const data = {
        clubId: clubId,
        content: content.trim(),
      };

      let requestData: FeedCreationRequest = {
        image: [],
        data,
        token,
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

  /*  const cancleCreate = () => {
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
          { text: "네", onPress: () => navigate("Tabs", { screen: "Home" }) },
        ],
        { cancelable: false }
    );
  };*/

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={pickImage}>
          <Entypo name="chevron-thin-left" size={20} color="black" />
        </TouchableOpacity>
      ),
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
  }, [imageURL, content, isSubmitShow]);

  /**
   * 이미지 리스트 선택하면 사진 크게보는쪽 사진뜨게
   */
  const ImageFIx = (i: any) => {
    setSelectIndex(i);
  };

  /** X선택시 사진 없어지는 태그 */
  const ImageCancle = (q: any) => {
    setImageURL((prev: string[]) => prev.filter((_, index) => index != q));
    if (selectIndex == q) setSelectIndex(0);
  };

  const renderItem = useCallback(
    ({ drag, isActive, item }: RenderItemParams<any> & { item: string }) => {
      return (
        <ScaleDecorator>
          <TouchableOpacity
            activeOpacity={1}
            onLongPress={drag}
            disabled={isActive}
            style={[
              {
                opacity: isActive ? 0.5 : 1,
              },
            ]}
          >
            <SelectImage source={{ uri: item }} />
            <ImageCancleBtn onPress={() => ImageCancle(imageURL.indexOf(item))}>
              <CancleIcon>
                <AntDesign name="close" size={15} color="white" />
              </CancleIcon>
            </ImageCancleBtn>
          </TouchableOpacity>
        </ScaleDecorator>
      );
    },
    [imageURL]
  );

  return (
    <Container>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
          <>
            <SelectImageView>
              <MyImage>
                <DraggableFlatList horizontal data={imageURL} onDragEnd={({ data }) => setImageURL(data)} keyExtractor={(item) => item} renderItem={(props) => renderItem({ ...props })} />
              </MyImage>
              {imageURL.length !== 0 ? <MoveImageText>사진을 옮겨 순서를 변경할 수 있습니다.</MoveImageText> : null}
            </SelectImageView>
            <FeedText
              placeholder="사진과 함께 남길 게시글을 작성해 보세요."
              onChangeText={(content: string) => setContent(content)}
              onEndEditing={() => setContent((prev) => prev.trim())}
              autoCapitalize="none"
              autoCorrect={false}
              multiline={true}
              returnKeyType="done"
              returnKeyLabel="done"
            ></FeedText>
          </>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Container>
  );
};

export default ImageSelecter;
