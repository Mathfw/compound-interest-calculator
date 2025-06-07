import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";

export const ThemeContext = createContext<{
  value: string,
  setValue: Dispatch<SetStateAction<string>>
}>({
  value: 'light',
  setValue: () => {}
})