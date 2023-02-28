import { Entypo } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { BlockUserListResponse, ErrorResponse, UserApi } from "../../api";
import { RootState } from "../../redux/store/reducers";

const Container = styled.SafeAreaView`
  flex: 1;
`;

const BlockUserList: React.FC<NativeStackScreenProps<any, "BlockUserList">> = ({ navigation: { navigate, setOptions, goBack } }) => {
  const toast = useToast();
  const { data: blockUserList, isLoading: blockUserListLoading } = useQuery<BlockUserListResponse, ErrorResponse>(["blockUserList"], UserApi.getBlockUserList, {
    onSuccess: (res) => {},
    onError: (error) => {
      console.log(`API ERROR | getBlockUserList ${error.code} ${error.status}`);
      toast.show(`${error.message ?? error.code}`, { type: "warning" });
    },
  });

  useEffect(() => {
    setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => goBack()}>
          <Entypo name="chevron-thin-left" size={20} color="black" />
        </TouchableOpacity>
      ),
    });
  }, []);
  return <Container></Container>;
};

export default BlockUserList;
