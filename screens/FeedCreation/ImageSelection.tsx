import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { AntDesign, Entypo } from "@expo/vector-icons";
import ImagePicker from "react-native-image-crop-picker";
import { ActivityIndicator, Alert, BackHandler, DeviceEventEmitter, KeyboardAvoidingView, Platform, ScrollView, StatusBar, TouchableOpacity, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { useMutation } from "react-query";
import { BaseResponse, ErrorResponse, FeedApi, FeedCreationRequest, ImageType } from "../../api";
import { useToast } from "react-native-toast-notifications";
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist";
import CustomTextInput from "../../components/CustomTextInput";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CustomText from "../../components/CustomText";
import { View } from "react-native";
import FastImage from "react-native-fast-image";

const Container = styled.View`
  flex: 1;
`;

const ContentInfo = styled.View`
  padding: 10px 10px 0px 0px;
  align-items: flex-end;
  justify-content: center;
`;

const InfoText = styled(CustomText)`
  font-size: 12px;
  color: #b5b5b5;
`;

const ContentView = styled.View`
  background-color: #f3f3f3;
  margin: 10px 10px 50px 10px;
  padding: 10px;
`;

const FeedTextInput = styled(CustomTextInput)`
  width: 100%;
  height: 300px;
  font-size: 14px;
  line-height: 20px;
`;

const HeaderView = styled.View`
  background-color: #f5f5f5;
  width: 100%;
  padding: 0px 20px 10px 20px;
`;

const ImageSelectionView = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const ImageSelectionButton = styled.TouchableOpacity<{ size: number }>`
  width: ${(props: any) => (props.size ? 55 : 0)}px;
  height: ${(props: any) => (props.size ? 55 : 0)}px;
  background-color: #ececec;
`;

const PlusText = styled.Text`
  font-weight: 100;
  color: #aaaaaa;
  font-size: 38px;
  text-align: center;
`;

const HeaderText = styled(CustomText)`
  color: #979797;
`;

const SelectImage = styled(FastImage)<{ size: number }>`
  width: ${(props: any) => (props.size ? 55 : 0)}px;
  height: ${(props: any) => (props.size ? 55 : 0)}px;
`;

const CancelIcon = styled.TouchableOpacity`
  position: absolute;
  width: 15px;
  right: 0px;
`;

interface ImageBundle {
  original: string;
  cropped: string;
}

const ImageSelection: React.FC<NativeStackScreenProps<any, "ImageSelection">> = ({
  navigation: { navigate, setOptions, goBack },
  route: {
    params: { clubId },
  },
}) => {
  const toast = useToast();
  const [imageURLs, setImageURLs] = useState<ImageBundle[]>([]);
  const [content, setContent] = useState<string>("");
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const SCREEN_PADDING_SIZE = 20;
  const IMAGE_SIZE = 55;
  const IMAGE_MAX = 5;
  const IMAGE_GAP_SIZE = (SCREEN_WIDTH - SCREEN_PADDING_SIZE * 2 - IMAGE_SIZE * IMAGE_MAX) / 4;
  const maxLength = 1000;

  const mutation = useMutation<BaseResponse, ErrorResponse, FeedCreationRequest>(FeedApi.createFeed, {
    onSuccess: (res) => {
      DeviceEventEmitter.emit("HomeAllRefetch");
      navigate("Tabs", { screen: "Home" });
    },
    onError: (error) => {
      console.log(`API ERROR | createFeed ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  useLayoutEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={onCancel}>
          <Entypo name="chevron-thin-left" size={20} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () =>
        mutation.isLoading ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity disabled={imageURLs.length < 1} onPress={onSubmit}>
            <CustomText style={{ color: "#2995FA", fontSize: 14, lineHeight: 20 }}>저장</CustomText>
          </TouchableOpacity>
        ),
    });
  }, [imageURLs, content, mutation.isLoading]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      onCancel();
      return true;
    });

    return () => {
      backHandler.remove();
    };
  }, []);

  const onCancel = () => Alert.alert("게시물 작성 취소", "게시글을 생성을 취소하시겠어요?", [{ text: "아니요" }, { text: "네", onPress: () => goBack() }], { cancelable: false });

  const onSubmit = () => {
    if (imageURLs.length == 0) return toast.show(`이미지를 1개 이상 선택하세요.`, { type: "warning" });
    if (content.length == 0) return toast.show(`글에 내용이 없습니다.`, { type: "warning" });

    let image: ImageType[] = [];
    for (let i = 0; i < imageURLs.length; i++) {
      const splitedURI = String(imageURLs[i].cropped).split("/");
      image.push({
        uri: Platform.OS === "android" ? imageURLs[i].cropped : imageURLs[i].cropped.replace("file://", ""),
        type: "image/jpeg",
        name: splitedURI[splitedURI.length - 1],
      });
    }

    let requestData: FeedCreationRequest = {
      image,
      data: {
        clubId,
        content: content.trim(),
      },
    };

    mutation.mutate(requestData);
  };

  const selectImage = async () => {
    try {
      const newImages = await ImagePicker.openPicker({
        mediaType: "photo",
        multiple: true,
        minFiles: 1,
        maxFiles: IMAGE_MAX - imageURLs.length,
      });

      if (imageURLs.length + newImages.length > IMAGE_MAX) {
        toast.show(`이미지는 ${IMAGE_MAX}개까지 선택할 수 있습니다.`, { type: "warning" });
        return;
      }

      let imageBundle: ImageBundle[] = [];
      for (let i = 0; i < newImages.length; i++) {
        let cropped = await ImagePicker.openCropper({
          mediaType: "photo",
          path: newImages[i].path,
          width: 1080,
          height: 1080,
          cropperCancelText: "Cancel",
          cropperChooseText: "Check",
          cropperToolbarTitle: "이미지를 크롭하세요",
          forceJpg: true,
        });

        if (imageURLs.length > IMAGE_MAX) {
          toast.show(`이미지는 ${IMAGE_MAX}개까지 선택할 수 있습니다.`, {
            type: "warning",
          });
          return;
        }
        imageBundle.push({ original: newImages[i].path, cropped: cropped.path });
      }
      setImageURLs((prev) => [...prev, ...imageBundle]);
    } catch (e) {}
  };

  const cropImage = async (index?: number) => {
    if (index === undefined) return;
    try {
      let cropped = await ImagePicker.openCropper({
        mediaType: "photo",
        path: imageURLs[index].original,
        width: 1080,
        height: 1080,
        cropperCancelText: "Cancel",
        cropperChooseText: "Check",
        cropperToolbarTitle: "이미지를 크롭하세요",
      });
      setImageURLs((prev) =>
        prev.map((bundle, idx) => {
          if (idx === index) bundle.cropped = cropped.path;
          return bundle;
        })
      );
    } catch (e) {}
  };

  const deleteImage = (q?: number) => {
    if (q === undefined) return;
    setImageURLs((prev) => prev.filter((_, index) => index != q));
  };

  const renderItem = ({ drag, isActive, item, getIndex }: RenderItemParams<ImageBundle>) => {
    return (
      <TouchableOpacity key={String(getIndex())} activeOpacity={1} onLongPress={drag} disabled={isActive} onPress={() => cropImage(getIndex())} style={{ opacity: isActive ? 0.5 : 1 }}>
        <ScaleDecorator>
          <SelectImage size={IMAGE_SIZE} source={{ uri: item.cropped }} />
          <CancelIcon onPress={() => deleteImage(getIndex())}>
            <AntDesign name="close" size={15} color="white" />
          </CancelIcon>
        </ScaleDecorator>
      </TouchableOpacity>
    );
  };

  const listFooterComponent = useCallback(
    () => (
      <ImageSelectionButton size={IMAGE_SIZE} onPress={selectImage}>
        <PlusText>+</PlusText>
      </ImageSelectionButton>
    ),
    []
  );

  const itemSeparatorComponent = useCallback(() => <View style={{ width: IMAGE_GAP_SIZE }} />, []);

  return (
    <Container>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={90} style={{ flex: 1 }}>
        <ScrollView>
          <HeaderView>
            <ImageSelectionView>
              <DraggableFlatList
                horizontal
                contentContainerStyle={{ width: "100%", paddingVertical: 10, justifyContent: "center", alignItems: "center" }}
                data={imageURLs}
                showsHorizontalScrollIndicator={false}
                onDragEnd={({ data }) => setImageURLs(data)}
                keyExtractor={(item, index: number) => String(index)}
                renderItem={renderItem}
                ItemSeparatorComponent={itemSeparatorComponent}
                ListFooterComponent={imageURLs.length < IMAGE_MAX ? listFooterComponent : <></>}
                ListFooterComponentStyle={imageURLs.length < IMAGE_MAX ? { marginLeft: IMAGE_GAP_SIZE } : {}}
              />
            </ImageSelectionView>
            <HeaderText>사진을 길게 눌러 순서를 변경할 수 있습니다.</HeaderText>
          </HeaderView>

          <ContentInfo>
            <InfoText>{`${content.length} / ${maxLength}`}</InfoText>
          </ContentInfo>
          <ContentView>
            <FeedTextInput
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
          </ContentView>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default ImageSelection;
