import React from "react";
import styled from "styled-components/native";
import CustomText from "./CustomText";

const TagView = styled.View<{ color: string }>`
  flex-direction: row;
  align-items: center;
  background-color: ${(props: any) => props.color};
  padding: 0px 3px;
  border-radius: 5px;
  margin-right: 5px;
  border: 1px solid ${(props: any) => (props.color === "white" ? "#A5A5A5" : "#B4B4B4")};
`;

const TagText = styled(CustomText)<{ color: string }>`
  font-family: "NotoSansKR-Medium";
  font-size: 10px;
  line-height: 14px;
  color: ${(props: any) => props.color};
`;

interface TagProps {
  name: string;
  textColor: string;
  backgroundColor: string;
}

const Tag: React.FC<TagProps> = ({ name, textColor, backgroundColor }) => {
  return (
    <TagView color={backgroundColor}>
      <TagText color={textColor}>{name}</TagText>
    </TagView>
  );
};
export default Tag;
