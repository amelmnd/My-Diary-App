// src/constants/emotionList.ts
import { e_Emotion } from "../types/e_Emotion";
import { i_Emotion } from "../types/i_Emotion";

export const emotionList: i_Emotion[] = [
  {
    label: "Angry",
    value: e_Emotion.ANGRY,
    image: require("../../assets/images/emotions/angry.png"),
  },
  {
    label: "Happy",
    value: e_Emotion.HAPPY,
    image: require("../../assets/images/emotions/happy.png"),
  },
  {
    label: "Joy",
    value: e_Emotion.JOY,
    image: require("../../assets/images/emotions/joy.png"),
  },
  {
    label: "Sad",
    value: e_Emotion.SAD,
    image: require("../../assets/images/emotions/sad.png"),
  },
  {
    label: "Sick",
    value: e_Emotion.SICK,
    image: require("../../assets/images/emotions/sick.png"),
  },
  {
    label: "Unhappy",
    value: e_Emotion.UNHAPPY,
    image: require("../../assets/images/emotions/unhappy.png"),
  },
];
