import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import styled from "styled-components/native";

const Loader = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Container = styled.SafeAreaView`
  flex: 1;
  justify-content: space-evenly;
  align-items: center;
`;

const SectionView = styled.View`
  width: 100%;
`;

const TitleText = styled.Text`
  font-size: 28px;
  font-weight: 500;
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
`;

const CategoryIcon = styled.Image`
  width: 45px;
  height: 45px;
  border-radius: 50px;
  margin-bottom: 8px;
  opacity: ${(props) => (props.selected ? "1" : "0.3")};
`;

const CategoryName = styled.Text``;

const NextButton = styled.TouchableOpacity`
  width: 200px;
  height: 40px;
  background-color: #40a798;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: white;
`;

const StepOne: React.FC<NativeStackScreenProps<any, "StepOne">> = ({
  navigation: { navigate },
}) => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([[{}]]);
  const [selectCategory, setCategory] = useState(null);

  const getCategories = () => {
    let items = [];
    const result = [];
    for (var i = 1; i < 13; ++i) {
      items.push({
        id: String(i),
        iconPath:
          "https://ima9ines.com/content/images/thumbs/0000017_featured-categories-plugin_300.png",
        name: "보드게임",
      });
      if (i % 3 === 0) {
        result.push(items);
        items = [];
      }
    }

    setCategories(result);
    setLoading(false);
  };

  useEffect(() => {
    getCategories();
  }, []);

  const onPressCategory = (name) => setCategory(name);

  return loading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <Container>
      <TitleText>카테고리를 고르세요.</TitleText>
      <SectionView>
        {categories.map((bundle, index) => {
          return (
            <CategoryView key={index}>
              {bundle.map((item, index) => {
                return (
                  <CategoryItem
                    key={index}
                    activeOpacity={0.6}
                    onPress={() => onPressCategory(item.name + item.id)}
                  >
                    <CategoryIcon
                      source={{
                        uri: item.iconPath,
                      }}
                      selected={item.name + item.id === selectCategory}
                    />
                    <CategoryName>{item.name}</CategoryName>
                  </CategoryItem>
                );
              })}
            </CategoryView>
          );
        })}
      </SectionView>

      <NextButton
        onPress={() => {
          if (selectCategory === null) {
            return Alert.alert("카테고리를 선택하세요!");
          } else {
            return navigate("StepTwo", { category: selectCategory });
          }
        }}
      >
        <ButtonText>다음</ButtonText>
      </NextButton>
    </Container>
  );
};

export default StepOne;
