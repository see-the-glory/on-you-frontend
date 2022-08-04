import React, { useState, useRef, useEffect } from "react";
import { FlatList, Text } from "react-native";
import * as Animatable from "react-native-animatable";
import styled from "styled-components";
import { search } from "./temp/config";
import mixIn from "../screens/temp/Minxin";

const Container = styled.View`
  top: -5px;
`;

const SearchBarWrap = styled.View`
  position: relative;
  ${mixIn.flex("row", "flex-start", "center")};
  width: 100%;
  background-color: white;
  border-radius: 10px;
`;

const Cancel = Animatable.createAnimatableComponent(styled.TouchableOpacity`
  display: ${({ touch }) => (touch.length > 0 ? "flex" : "none")};
  padding-left: 10px;
`);

const SearchIcon = styled.Image`
  position: absolute;
  left: 10px;
  width: 20px;
  height: 20px;
  z-index: ${({ touch }) => (touch.length > 0 ? -1 : 1)};
`;

const SearchBar = Animatable.createAnimatableComponent(styled.TextInput`
  width: ${({ touch }) => (touch.length > 0 ? "90%" : "95%")};
  height: 40px;
  left: 30px;
  border-radius: 10px;
`);

const ResultContainer = styled.View`
  height: 100%;
  background-color: transparent
`;

const ResultLabel = styled.Text`
  height: 50px;
  padding-left: 10px;
  line-height: 60px;
  font-size: 12px;
  color: gray;
`;

const ResultList = styled.TouchableOpacity`
  height: 60px;
  padding-left: 10px;
  border: 0.3px solid #ddd;
  background-color: white
`;

const ResultItem = styled.Text`
  line-height: 60px;
`;

const typed = {
    0: {
        width: "100%",
    },
    1: {
        width: "88%",
    },
};

const btnIn = {
    0: {
        animation: false,
    },
    1: {
        animation: "slideInRight",
    },
};

export default function Temp({ navigation }) {
    const [searchVal, setSearchVal] = useState("");
    const [data, setData] = useState();
    const searchRef = useRef();

    const searchData = async (text) => {
        try {
            setSearchVal(text);
            const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyD0fcEOaCavJo_udjes29TWSn6PTpbFlDM`, {
                method: "GET",
                body: JSON.stringify({
                    keyword: text,
                }),
            });
            const resJson = await res.json();
            const newResJson = resJson.data;
            setData(newResJson);
        } catch (e) {
            console.log("페치에 실패했습니다.");
        }
    };

    const renderItem = ({ item }) => {
        return (
            <ResultList
                onPress={() =>
                    navigation.navigate("ProductDetail", {
                        productId: item.id,
                    })
                }
            >
                <ResultItem>{item.name}</ResultItem>
            </ResultList>
        );
    };

    const clearInput = () => {
        searchRef.current.ref.clear();
        setSearchVal("");
        setData("");
    };

    return (
        <Container>
            <SearchBarWrap>
                <SearchIcon
                    source={{
                        uri: "https://webstockreview.net/images/search-icon-png-4.png",
                    }}
                    touch={searchVal}
                />
                <SearchBar
                    ref={searchRef}
                    placeholder="검색어를 입력해 주세요"
                    onChangeText={(text) => searchData(text)}
                    touch={searchVal}
                    animation={searchVal.length > 0 ? typed : false}
                                    />
                <Cancel
                    touch={searchVal}
                    animation={searchVal.length > 0 ? btnIn : false}
                    onPress={() => clearInput()}
                >
                    <Text>취소</Text>
                </Cancel>
            </SearchBarWrap>
            <ResultContainer>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item, idx) => idx.toString()}
                />
            </ResultContainer>
        </Container>
    );
}


