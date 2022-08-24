import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { ClubCreationStepOneScreenProps } from "../../types/Club";
import { Category } from "../../api";

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

const CategoryItem = styled.TouchableOpacity<{ selected: boolean }>`
  width: 100px;
  height: 35px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.selected ? "#295AF5" : "white")};
  border-radius: 20px;
  border: 1px solid #c3c3c3;
  padding: 0px 15px 0px 15px;
`;

const CategoryIcon = styled.Image<{ selected: boolean }>`
  border-radius: 10px;
  opacity: ${(props) => (props.selected ? "1" : "0.3")};
  ${(props) => (props.selected ? "background-color: #295AF5;" : "")};
`;

const CategoryText = styled.Text<{ selected: boolean }>`
  font-size: 18px;
  color: ${(props) => (props.selected ? "white" : "black")};
  font-weight: 500;
`;

const NextButton = styled.TouchableOpacity`
  width: 200px;
  height: 40px;
  background-color: ${(props) => (props.disabled ? "#c4c4c4" : "#295AF5")};
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: white;
`;

const ClubCreationStepOne: React.FC<ClubCreationStepOneScreenProps> = ({
  navigation: { navigate },
  route: {
    params: { category },
  },
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<Array<Array<Category>>>([[]]);
  const [selectCategory1, setCategory1] = useState<number>(-1);
  const [selectCategory2, setCategory2] = useState<number>(-1);

  const getCategories = () => {
    const result = [];
    const categoryViewSize = 3;
    let pos = 0;

    while (pos < category.data.length) {
      result.push(category.data.slice(pos, pos + categoryViewSize));
      pos += categoryViewSize;
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
              <Ionicons name="checkmark-sharp" size={16} color="#8b8b8b" /> 중복선택 2개까지 가능
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
                return navigate("ClubCreationStepTwo", {
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
          {item.map((categoryItem, index) => {
            return (
              <CategoryItem key={index} activeOpacity={0.8} onPress={() => onPressCategory(categoryItem.id)} selected={categoryItem.id === selectCategory1 || categoryItem.id === selectCategory2}>
                <CategoryText selected={categoryItem.id === selectCategory1 || categoryItem.id === selectCategory2}>{categoryItem.name}</CategoryText>
              </CategoryItem>
            );
          })}
        </CategoryView>
      )}
    />
  );
};

export default ClubCreationStepOne;
