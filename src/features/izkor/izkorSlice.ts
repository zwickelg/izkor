import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IzkorState {
  theme: "darkTheme" | "lightTheme";
  firstName: string;
  lastName: string;
  gender: "male" | "female";
  parentName: string;
  version: "sephardic" | "ashkenazic";
  mode: "readonly" | "all";
}

const initialState: IzkorState = {
  theme: "darkTheme",
  firstName: "",
  lastName: "",
  gender: "male",
  parentName: "",
  version: "ashkenazic",
  mode: "all",
};

export const izkorSlice = createSlice({
  name: "counter",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "darkTheme" ? "lightTheme" : "darkTheme";
      console.log("redux theme");
    },
    setFirstName: (state, action: PayloadAction<string>) => {
      state.firstName = action.payload;
      console.log("redux firstName");
    },
    setLastName: (state, action: PayloadAction<string>) => {
      state.lastName = action.payload;
    },
    setGender: (state, action: PayloadAction<"male" | "female">) => {
      state.gender = action.payload;
    },
    setParentName: (state, action: PayloadAction<string>) => {
      state.parentName = action.payload;
    },
    setVersion: (state, action: PayloadAction<"sephardic" | "ashkenazic">) => {
      state.version = action.payload;
    },
    updateFields: (state, action: PayloadAction<Partial<IzkorState>>) => {
      state.mode = "readonly";
      Object.assign(state, action.payload);
    },
  },
});

export const {
  toggleTheme,
  setFirstName,
  setLastName,
  setGender,
  setParentName,
  setVersion,
  updateFields,
} = izkorSlice.actions;

export default izkorSlice.reducer;
