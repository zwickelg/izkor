import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../features/izkor/izkorSlice";
import { RootState } from "../../app/store";
import themeSwitch from "./ThemeSwitch.module.css";
const ThemeSwitch: React.FC = () => {
  const [isChecked, setIsChecked] = useState(true);

  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.izkor);
  const isDarkMode = formData.theme === "darkTheme" ? true : false;
  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <div>
      <label className={themeSwitch.switch}>
        <input type="checkbox" checked={isDarkMode} onChange={handleToggle} />

        <span className={themeSwitch.slider}></span>
      </label>
    </div>
  );
};

export default ThemeSwitch;
