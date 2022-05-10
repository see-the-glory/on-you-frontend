import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  useWindowDimensions,
} from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

const Loader = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const HeaderView = styled.View`
  flex-direction: column;
  align-items: center;
`;

const H1 = styled.Text`
  font-size: 28px;
  font-weight: 900;
  margin-bottom: 15px;
`;

const H2 = styled.Text`
  font-size: 18px;
  color: #5c5c5c;
  margin-bottom: 20px;
`;

const H3 = styled.Text`
  font-size: 16px;
  font-weight: 300;
  margin-left: 150px;
  color: #8b8b8b;
`;

const CategoryView = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 15px;
  margin-top: 15px;
`;

const CategoryItem = styled.TouchableOpacity`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #c4c4c4;
  border-radius: 10px;
`;

const CategoryIcon = styled.Image<{ selected: boolean }>`
  width: 180px;
  height: 140px;
  border-radius: 10px;
  opacity: ${(props) => (props.selected ? "1" : "0.3")};
`;

const CategoryText = styled.Text`
  position: absolute;
  font-size: 21px;
  color: white;
  font-weight: 800;
`;

const NextButton = styled.TouchableOpacity`
  width: 200px;
  height: 40px;
  background-color: ${(props) => (props.disabled ? "#c4c4c4" : "#40a798")};
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: white;
`;

interface CategoryProps {
  id: number;
  iconPath: string;
  name: string;
}

const StepOne: React.FC<NativeStackScreenProps<any, "StepOne">> = ({
  navigation: { navigate },
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<Array<Array<CategoryProps>>>([
    [],
  ]);
  const [selectCategory1, setCategory1] = useState<number>(-1);
  const [selectCategory2, setCategory2] = useState<number>(-1);
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  const getCategories = () => {
    let items = [];
    const cName = [
      "독서",
      "경건생활",
      "봉사",
      "운동",
      "문화생활",
      "게임",
      "창작",
      "자기개발",
      "음식",
      "여행",
      "반려동물",
      "기타",
    ];
    const result = [];
    for (var i = 1; i < 13; ++i) {
      items.push({
        id: i,
        iconPath:
          "https://images.unsplash.com/photo-1553729784-e91953dec042?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80",
        name: cName[i - 1],
      });
      if (i % 2 === 0) {
        result.push(items);
        items = [];
      }
    }

    if (items.length !== 0) {
      result.push(items);
    }

    setCategories(result);
    setLoading(false);
  };

  useEffect(() => {
    getCategories();
  }, []);

  const onPressCategory = (id: number) => {
    if (selectCategory1 === id) {
      return setCategory1(-1);
    } else if (selectCategory2 === id) {
      return setCategory2(-1);
    }
    if (selectCategory1 === -1) {
      return setCategory1(id);
    } else if (selectCategory2 === -1) {
      return setCategory2(id);
    } else {
      Alert.alert("카테고리는 2개만 고를 수 있습니다.");
    }
  };

  return loading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <FlatList
      ListHeaderComponentStyle={{ marginTop: 30, marginBottom: 10 }}
      ListHeaderComponent={
        <>
          <HeaderView>
            <H1>카테고리</H1>
            <H2>개설하실 모임의 카테고리를 선택해주세요.</H2>
            <H3>
              <Ionicons name="checkmark-sharp" size={16} color="#8b8b8b" />{" "}
              중복선택 2개까지 가능
            </H3>
          </HeaderView>
        </>
      }
      ListFooterComponentStyle={{
        marginTop: 30,
        marginBottom: 80,
        alignItems: "center",
      }}
      ListFooterComponent={
        <>
          <NextButton
            onPress={() => {
              if (selectCategory1 === null && selectCategory2 === null) {
                return Alert.alert("카테고리를 선택하세요!");
              } else {
                return navigate("StepTwo", {
                  category1: selectCategory1,
                  category2: selectCategory2,
                });
              }
            }}
            disabled={selectCategory1 === -1 && selectCategory2 === -1}
          >
            <ButtonText>다음 1/3</ButtonText>
          </NextButton>
        </>
      }
      data={categories}
      keyExtractor={(item, index) => index + ""}
      renderItem={({ item }) => (
        <CategoryView>
          {item.map((category, index) => {
            return (
              <CategoryItem
                key={index}
                activeOpacity={0.8}
                onPress={() => onPressCategory(category.id)}
              >
                <CategoryIcon
                  source={{
                    uri: category.iconPath,
                  }}
                  selected={
                    category.id === selectCategory1 ||
                    category.id === selectCategory2
                  }
                />
                <CategoryText>{category.name}</CategoryText>
              </CategoryItem>
            );
          })}
        </CategoryView>
      )}
    />
  );
};

export default StepOne;
