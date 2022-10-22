import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { ClubCreationStepOneScreenProps } from "../../Types/Club";
import { Category } from "../../api";
import CustomText from "../../components/CustomText";
import { useToast } from "react-native-toast-notifications";

const Loader = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const HeaderView = styled.View`
  align-items: center;
  justify-content: center;
`;

const H1 = styled(CustomText)`
  font-size: 18px;
  line-height: 25px;
  font-family: "NotoSansKR-Bold";
  margin: 10px 0px;
`;

const H2 = styled(CustomText)`
  font-size: 14px;
  color: #5c5c5c;
  margin-bottom: 15px;
`;

const HeaderSubView = styled.View`
  width: 100%;
  align-items: flex-end;
  justify-content: center;
`;

const H3 = styled(CustomText)`
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
  width: 105px;
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

const CategoryText = styled(CustomText)<{ selected: boolean }>`
  font-size: 13px;
  line-height: 20px;
  color: ${(props) => (props.selected ? "white" : "black")};
`;

const NextButton = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  background-color: ${(props) => (props.disabled ? "#c4c4c4" : "#FF714B")};
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled(CustomText)`
  font-size: 18px;
  line-height: 25px;
  font-family: "NotoSansKR-Bold";
  color: white;
`;

const ClubCreationStepOne: React.FC<ClubCreationStepOneScreenProps> = ({
  navigation: { navigate },
  route: {
    params: { category },
  },
}) => {
  const toast = useToast();
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
      toast.show("카테고리는 2개만 고를 수 있습니다.", {
        type: "warning",
      });
    }
  };

  return loading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <FlatList
      ListHeaderComponentStyle={{ marginTop: 20, marginBottom: 10, paddingHorizontal: 20 }}
      ListHeaderComponent={
        <>
          <HeaderView>
            <H1>카테고리</H1>
            <H2>개설하실 모임의 카테고리를 선택해주세요.</H2>
            <HeaderSubView>
              <H3>
                <Ionicons name="checkmark-sharp" size={16} color="#8b8b8b" /> 중복선택 2개까지 가능
              </H3>
            </HeaderSubView>
          </HeaderView>
        </>
      }
      ListFooterComponentStyle={{
        marginTop: 30,
        marginBottom: 80,
        paddingHorizontal: 20,
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
                <CategoryText selected={categoryItem.id === selectCategory1 || categoryItem.id === selectCategory2}>
                  {categoryItem.thumbnail} {categoryItem.name}
                </CategoryText>
              </CategoryItem>
            );
          })}
        </CategoryView>
      )}
    />
  );
};

export default ClubCreationStepOne;
