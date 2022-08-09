import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { User, Category } from "../api";

export type EditStackParamList = {
  EditProfile: {
    userData: User;
    category: Category;
  };
};

export type EditProfileScreenProps = NativeStackScreenProps<EditStackParamList, "EditProfile">;
