import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    position: 0,
};

const scrollSlice = createSlice({
    name: "scroll",
    initialState,
    reducers: {
      saveScrollPosition: (state, action) => {
        state.position = action.payload;
        
      },
    },
  });

export const { saveScrollPosition } = scrollSlice.actions;
export default scrollSlice.reducer;
