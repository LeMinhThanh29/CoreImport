import { useState, createContext } from "react";
const ThemeContext = createContext();
function GlobalProvider({ children }) {
  const [toggle, setToggle] = useState(false);
  const [newCty, SetNewcty] = useState(false);
  const [department, setDepartment] = useState(false);
  const toggleTheme = () => {
    setToggle(!toggle);
  };
  return (
    <ThemeContext.Provider
      value={{
        toggle,
        toggleTheme,
        setToggle,
        SetNewcty,
        setDepartment,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
export { ThemeContext, GlobalProvider };
