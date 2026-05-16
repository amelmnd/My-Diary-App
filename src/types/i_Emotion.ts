// src/types/i_Emotion.ts
import { ImageSourcePropType } from "react-native";
import { e_Emotion } from "./e_Emotion";

export interface i_Emotion {
  label: string;
  value: e_Emotion;
  image: ImageSourcePropType;
}
