import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity, Button } from "react-native";
import { StatusBar } from "react-native";
import styled from "styled-components/native";
//img
import Icon from "react-native-vector-icons/Ionicons";

const Container = styled.SafeAreaView`
  position: relative;
  flex-direction: column;
  height: 100%;
`;

const Scroll = styled.ScrollView`
  background-color: black;
`;

const MainArea = styled.View`
  justify-content: space-between;
`;

const MainLogo = styled.Text`
  flex-direction: row;
  justify-content: space-between;
  background-color: black;
`;
const PlusFeed = styled.Button`
  color: white;
  margin-left: 200px;
`;

const HeaderStyle = styled.View`
  background-color: black;
`;
const HeaderText = styled.Text`
  flex-direction: row;
`;

const UserId = styled.Text`
  color: white;
  height: 20px;
  top: 20px;
  left: 5px;
  font-weight: bold;
`;

const ImagePrint = styled.Image`
  width: 100%;
  height: 300px;
  justify-content: center;
  align-items: center;
`;

const TextArea = styled.View`
  background-color: black;
  flex-direction: row;
  margin-top: 5px;
`;
const LogoImage = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 100px;
  z-index: 1;
`;

const LikeImg = styled.Image`
  width: 20px;
  height: 20px;
  border-radius: 100px;
  z-index: 1;
`;

const LikeMent = styled.Text`
  color: white;
  margin-left: 10px;
`;
const BoldText = styled.Text`
  font-weight: bold;
`;
const ContentMent = styled.View`
  background-color: black;
  flex-direction: row;
`;
const MentId = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 15px;
`;

const Ment = styled.Text`
  color: white;
  margin-left: 10px;
  width: 200px;
`;

export default function Home() {
  const [text, onChangeText] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isPress, setIsPress] = React.useState(true);

  const onChangeSearch = (query) => setSearchQuery(query);

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState();

  return (
    <Container>
      <StatusBar />
      <Scroll>
        <MainArea>
          <MainLogo>
            {/*<Image style={styles.logo} source={logo}/>*/}
            <Text
              style={{
                color: "white",
                fontSize: 40,
                fontWeight: "bold",
              }}
            >
              OnYou
            </Text>
            <Button title="+" color="#fff" />
          </MainLogo>

          <HeaderStyle>
            <HeaderText>
              {/*<LogoImage source={require('../screens/img/logo.png')}/>*/}
              <LogoImage source={{ uri: "https://i.pinimg.com/564x/79/3b/74/793b74d8d9852e6ac2adeca960debe5d.jpg" }} />
              <UserId>GyuBin</UserId>
              {/*id*/}
              <TouchableOpacity>
                <Icon
                  name="ellipsis-horizontal"
                  size={30}
                  style={{
                    marginLeft: 250,
                    color: "white",
                    top: 10,
                  }}
                />
              </TouchableOpacity>
            </HeaderText>
            <ImagePrint source={{ uri: "https://i.pinimg.com/564x/96/c8/3f/96c83fbf9b5987f24b96d529e9990b19.jpg" }} />
          </HeaderStyle>
          <TextArea>
            <LikeImg source={{ uri: "https://i.pinimg.com/564x/96/a1/11/96a111a649dd6d19fbde7bcbbb692216.jpg" }} />
            <LikeImg source={{ uri: "https://i.pinimg.com/564x/23/58/ec/2358ec9140ebe494df99beedf70c6c33.jpg" }} />
            <LikeImg source={{ uri: "https://i.pinimg.com/564x/96/c8/3f/96c83fbf9b5987f24b96d529e9990b19.jpg" }} />
            {/*<LikeMent>
                            <BoldText>GyuBin</BoldText>님 외 <BoldText>192</BoldText>명이 좋아합니다
                        </LikeMent>*/}
          </TextArea>
          <ContentMent>
            <MentId>GyuBin</MentId>
            <Ment>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
              galley of type and scrambled it to make a type specimen book.{" "}
            </Ment>
          </ContentMent>
        </MainArea>
      </Scroll>
    </Container>
  );
}
