import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
    name:"user",
    initialState:{
        email:null,
        userId:null,
        username:null,
        profilePicture:null,
    },
    reducers:{
        setUser(state,action){
            const {username,profilePicture,email,userId} = action.payload;
            state.email=email;
            state.userId=userId;
            state.username=username;
            state.profilePicture=profilePicture;
        },
        clearUser(state){
            state.email=null;
            state.userId=null;
        },
    },
});
export const {setUser,clearUser}= userSlice.actions
export default userSlice.reducer;   