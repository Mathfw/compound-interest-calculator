import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";

export const LangContext = createContext<{
  value: string,
  setValue: Dispatch<SetStateAction<string>>
}>({
  value: 'en-US',
  setValue: () => {}
});