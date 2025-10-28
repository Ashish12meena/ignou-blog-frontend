import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "posts",
  initialState: {
    data: [],
    scrollPosition: 0,
  },
  reducers: {
    setPosts: (state, action) => {
      state.data = action.payload;
    },
    appendPosts: (state, action) => {
      state.data = [...state.data, ...action.payload]; // ✅ Appends posts instead of replacing
    },
    setScrollPosition: (state, action) => {
      state.scrollPosition = action.payload;
    },
  },
});

export const { setPosts, appendPosts, setScrollPosition } = postSlice.actions;
export default postSlice.reducer;
