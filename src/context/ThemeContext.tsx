import { ReactNode, useState } from "react";
import { ThemeContext } from "../utils/hooks/useTheme";
import { darkTheme, lightTheme, Theme } from "../utils/hooks";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(lightTheme);

  const toggleTheme = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
