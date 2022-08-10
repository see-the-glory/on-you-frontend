import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Alert, Keyboard, Text, TouchableWithoutFeedback, useWindowDimensions, View, Image } from "react-native";
import styled from "styled-components/native";

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
  height: 50%;
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
  color: #c0c0c0;
`;

const SelectImageView = styled.View`
  background-color: gray;
  height: 70px;
  width: 100%;
  flex-direction: row;
  justify-content: space-around;
`;

const SelectImage = styled.Image`
  width: 55px;
  height: 55px;
  margin: 8px;
`;

const ImageSelecter: React.FC<NativeStackScreenProps> = ({ navigation: { navigate } }) => {
  const Stack = createNativeStackNavigator();
  const [refreshing, setRefreshing] = useState(false);
  //사진권한 허용
  const [imageURI, setImageURI] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  let [alert, alertSet] = useState(true);

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

  /*    const mutation = useMutation(HomeApi.createPeed, {
            onMutate: (data) => {
                console.log("--- Mutate ---");
                console.log(data);
            },
            onSuccess: (data) => {
                console.log("--- Success ---");
                console.log(data);
            },
            onError: (error) => {
                console.log("--- Error ---");
                console.log(error);
            },
            onSettled: (data, error) => {
                console.log("--- Settled ---");
                console.log(data);
                console.log(error);
            },
        });*/
  //카테고리 선택
  const [postText, setPostText] = useState("");
  const onText = (text: React.SetStateAction<string>) => setPostText(text);

  const cancleCreate = () =>
    Alert.alert(
      // 말그대로 Alert를 띄운다
      "취소하시겠습니까?", // 첫번째 text: 타이틀 제목
      "게시글이 삭제됩니다.", // 두번째 text: 그 밑에 작은 제목
      [
        // 버튼 배열
        {
          text: "아니요",
          // 버튼 제목  //onPress 이벤트시 콘솔창에 로그를 찍는다
          style: "cancel",
        },
        { text: "네", onPress: () => navigate("Home") }, //버튼 제목
        // 이벤트 발생시 로그를 찍는다
      ],
      { cancelable: false }
    );

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

  const createFinish = () => {
    Alert.alert("등록되었습니다.");
    setRefreshing(true);
    return navigate("Home");

    //홈화면 새로고침 기능 넣기
  };

  /* const onSubmit = () => {
    const data = {
      category1Id: category1,
      category2Id: category2,
      clubName,
      clubMaxMember: clubMemberCount,
      clubShortDesc: briefIntroText,
      clubLongDesc: detailIntroText,
      isApproveRequired: approvalMethod === 0 ? "N" : "Y",
    };

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
              uri: imageURI.replace("file://", ""),
              type: "image/jpeg",
              name: splitedURI[splitedURI.length - 1],
            },
            data,
            token,
          };

    mutation.mutate(requestData);
  }; */

  /*    const createHomeFeed=async ()=>{
            try{
                setLoading(true);
                const response= await axios.post(
                    `http://3.39.190.23:8080/api/clubs`
                );
                setData(response.data.data)
                Alert.alert("등록되었습니다.");
                setRefreshing(true);
                return navigate("Home");
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }*/

  useEffect(() => {
    let timer = setTimeout(() => {
      alertSet(false);
    }, 3000);
  });

  const ImageCancle = () => {
    source: {
      {
        uri: "";
      }
    }
  };

  return (
    <Container>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <ImagePickerView>
            <ImagePickerButton height={imageHeight} onPress={pickImage} activeOpacity={1}>
              {imageURI ? (
                // <PickedImage height={imageHeight} source={{ uri: imageURI }} />
                <PickedImage height={imageHeight} source={{ uri: imageURI }} />
              ) : (
                <PickBackground>
                  {/* <PickBackground source={{ uri: "https://i.pinimg.com/564x/5c/4b/96/5c4b96e7e16aef00a926b6be209a7e3c.jpg" }}> */}
                  {alert === true ? (
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
            <SelectImage source={{ uri: "https://i.pinimg.com/564x/5c/4b/96/5c4b96e7e16aef00a926b6be209a7e3c.jpg" }} />
            <SelectImage source={{ uri: "https://i.pinimg.com/564x/a6/69/e3/a669e31fdc751d576e1b0260e60022a9.jpg" }} />
            <SelectImage source={{ uri: "https://i.pinimg.com/564x/c5/09/38/c509384458795569b0788a016b0fbc06.jpg" }} />
            <SelectImage source={{ uri: "https://i.pinimg.com/564x/9e/d8/4c/9ed84cf3fc04d0011ec4f75c0692c83e.jpg" }} />
            <SelectImage source={{ uri: "https://i.pinimg.com/564x/aa/26/04/aa2604e4c5e060f97396f3f711de37c1.jpg" }} />
          </SelectImageView>
          <FeedText
            // key={"FeedCreateRequest"}
            placeholder="사진과 함께 남길 게시글을 작성해 보세요."
            onChangeText={setTitle}
            textContentType="none"
            autoCompleteType="off"
            autoCapitalize="none"
            multiline={true}
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
          {/*<OptionSelector>
                        <CtgrArea>
                            <Text>내 모임</Text>
                            <SelectDropdown
                                data={category}
                                onSelect={(selectedItem, index) => {
                                    console.log(selectedItem, index)
                                }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    return selectedItem
                                }}
                                rowTextForSelection={(item, index) => {
                                    return item
                                }}
                            />

                        </CtgrArea>
                    </OptionSelector>*/}
          {/*<AllBtn>
                        <ButtonArea>
                            <NextButton
                                onPress={cancleCreate}>
                                <ButtonText>취소하기</ButtonText>
                            </NextButton>
                        </ButtonArea>
                        <ButtonArea>
                            <NextButton
                                onPress={() => {
                                    if(imageURI===null) {
                                        return Alert.alert("이미지를 선택하세요!");
                                    }
                                    else if(title===""){
                                        return Alert.alert("문구를 입력해라");
                                    }
                                    else if(!category){
                                        return Alert.alert("카테고리를 선택하세요!");
                                    }
                                    else{
                                        createFinish();
                                    }
                                    createFinish();
                                }}
                            >
                                <ButtonText>공유하기</ButtonText>
                            </NextButton>
                        </ButtonArea>
                    </AllBtn>*/}
        </>
      </TouchableWithoutFeedback>
    </Container>
  );
};

export default ImageSelecter;
