import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  primaryColor: "#22C55E",
  secondaryColor: "#BBF7D0",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setColors: (state, action) => {
      const { primaryColor, secondaryColor } = action.payload;
      state.primaryColor = primaryColor;
      state.secondaryColor = secondaryColor;
    },
  },
});

export const { setColors } = themeSlice.actions;
export const getColors = (state) => state.theme;

export default themeSlice.reducer;
