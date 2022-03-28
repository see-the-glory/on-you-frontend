import React, { useState, useEffect } from 'react';
import {Button, Image, View, Platform, Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import styled from "styled-components/native";

const Container = styled.SafeAreaView`
  flex: 1;
`;

const ImageArea=styled.Button`
top: 30px;
`

const ImageSelector=styled.View`
  flex-direction: row;
  
`

const Circle=styled.Image`
 top: 90px;
`

const TextInPut=styled.TextInput`
  color: black;
`
const PublicArea=styled.View`
  flex-direction: row;
`
const CtgrArea=styled.View`
  flex-direction: row;
`
const ButtonArea=styled.View`
  flex: 1;
  justify-content: space-evenly;
  align-items: center;
`
const NextButton = styled.TouchableOpacity`
  width: 200px;
  height: 40px;
  background-color: #40a798;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  top: 30px;
`;
const ButtonText = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: white;
`;

export default function ImageSelecter({navigation: {navigate}}) {
    const [image, setImage] = useState(null);
    const [selectCategory, setCategory] = useState(null);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    return (
        <Container>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ImageArea title="Pick an image from camera roll" onPress={pickImage} />
                {image && <Circle source={{ uri: image }} style={{ width: 350, height: 300 }} />}
            </View>
            <ButtonArea>
                <NextButton
                    onPress={() => {
                        if(image===null) {
                            return Alert.alert("이미지를 선택하세요!");
                        }else{
                            return navigate("CreateHomePeed");
                        }

                    }}
                >
                    <ButtonText>다음</ButtonText>
                </NextButton>
            </ButtonArea>
        </Container>
    );
}
