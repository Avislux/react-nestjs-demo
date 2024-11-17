import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store.ts';

// Home.jsx
function HomePage() {
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.users);

  return (
    <div>
      <h1>Home Page</h1>
      <div> {userState.user ? "Hello " + userState.user.name : "You are not signed in"}</div>
    </div>
  );
}

export default HomePage;