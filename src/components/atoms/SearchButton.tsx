import React from "react";
import styled from "styled-components/native";
import { Iconify } from "react-native-iconify";

const Button = styled.TouchableOpacity`
  flex-direction: row;
  background-color: #f8f8f8;
  border-radius: 10px;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0px 10px;
`;

const SearchText = styled.Text`
  font-family: ${(props) => props.theme.koreanFontR};
  font-size: 16px;
  color: #c4c4c4;
`;

interface SearchButtonProps {
  onPress: () => void;
  text: string;
}

const SearchButton: React.FC<SearchButtonProps> = ({ onPress, text }) => {
  return (
    <Button activeOpacity={1} onPress={onPress}>
      <SearchText>{text}</SearchText>
      <Iconify icon="ion:search" size={18} color={"#8E8E8E"} />
    </Button>
  );
};

export default SearchButton;
