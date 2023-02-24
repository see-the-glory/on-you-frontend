import { Entypo } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import styled from "styled-components/native";
import { BlockUserListResponse, UserApi } from "../../api";
import { RootState } from "../../redux/store/reducers";

const Container = styled.SafeAreaView`
  flex: 1;
`;

const BlockUserList: React.FC<NativeStackScreenProps<any, "BlockUserList">> = ({ navigation: { navigate, setOptions, goBack } }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const toast = useToast();
  console.log(token);
  const { data: blockUserList, isLoading: blockUserListLoading } = useQuery<BlockUserListResponse>(["blockUserList", { token }], UserApi.getBlockUserList, {
    onSuccess: (res) => {
      console.log(res);
      if (res.status === 200) {
      } else {
        toast.show(`유저목록을 불러오지 못했습니다. (status: ${res.status})`, {
          type: "warning",
        });
      }
    },
    onError: (error) => {
      console.log(error);
      toast.show(`유저목록을 불러오지 못했습니다. (error: ${error})`, {
        type: "warning",
      });
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
