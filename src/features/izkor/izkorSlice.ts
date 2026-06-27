import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IzkorState {
  theme: "darkTheme" | "lightTheme";
  firstName: string;
  lastName: string;
  gender: "male" | "female";
  parentName: string;
  version: "sephardic" | "ashkenazic";
  mode: "readonly" | "all";
  deathDate: string;
  graveLocation: { lat: number; lng: number } | null;
}

const initialState: IzkorState = {
  theme: "darkTheme",
  firstName: "",
  lastName: "",
  gender: "male",
  parentName: "",
  version: "ashkenazic",
  mode: "all",
  deathDate: "",
  graveLocation: null,
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
    setDeathDate: (state, action: PayloadAction<string>) => {
      state.deathDate = action.payload;
    },
    setGraveLocation: (state, action: PayloadAction<{ lat: number; lng: number } | null>) => {
      state.graveLocation = action.payload;
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
  setDeathDate,
  setGraveLocation,
  updateFields,
} = izkorSlice.actions;

export default izkorSlice.reducer;
