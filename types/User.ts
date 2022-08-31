import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { User, CategoryResponse } from "../api";

export type EditStackParamList = {
  EditProfile: {
    userData: User;
    category: CategoryResponse;
  };
};

export type EditProfileScreenProps = NativeStackScreenProps<EditStackParamList, "EditProfile">;
