import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import styled from "styled-components/native";

const Container = styled.View<{ kerning: number }>`
  position: relative;
  justify-content: center;
  align-items: center;
  margin-right: ${(props) => props.kerning}px;
`;

const BadgeIcon = styled.View`
  position: absolute;
  z-index: 2;
  elevation: 3;
  top: 0;
  right: 0%;
  background-color: white;
  border-radius: 10px;
`;

const Backplate = styled.TouchableOpacity<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: ${(props) => Math.ceil(props.size / 2)}px;
  justify-content: center;
  align-items: center;
  border: 1px;
  border-color: rgba(0, 0, 0, 0.1);
  background-color: white;
  margin-bottom: 8px;
  box-shadow: 1px 1px 1px gray;
  elevation: 2;
`;

const IconImage = styled.Image<{ size: number }>`
  width: ${(props) => props.size - 5}px;
  height: ${(props) => props.size - 5}px;
  border-radius: ${(props) => Math.ceil(props.size / 2)}px;
`;

const CircleName = styled.Text`
  font-weight: 600;
`;

interface CircleIconProps {
  size: number;
  uri: string;
  name?: string;
  badge?: "check-circle" | "stars";
  kerning?: number;
}

const CircleIcon: React.FC<CircleIconProps> = ({ size, uri, name, badge, kerning }) => {
  return (
    <Container kerning={kerning ? kerning : 0}>
      {badge ? (
        <BadgeIcon>
          <MaterialIcons name={badge} size={18} color="#ff714b" />
        </BadgeIcon>
      ) : (
        <></>
      )}
      <Backplate size={size}>
        <IconImage source={{ uri: uri }} size={size} />
      </Backplate>
      {name ? <CircleName>{name}</CircleName> : <></>}
    </Container>
  );
};

export default CircleIcon;
