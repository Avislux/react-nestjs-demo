import React, { useState } from 'react';
import localforage from 'localforage';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/userSlice.ts';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    // @ts-ignore
    dispatch(loginUser({ email, password })).then(action => {
      if (action.error){
        setError(action.payload || "Credential error");
        setTimeout(()=>{
          setError(null);
        }, 5000);
      } else {
        localforage.setItem('token', action.payload.access_token);
        localforage.setItem('name', action.payload.name);
        navigate("/");
      }
    });
  };
  //email: z.string().email(),

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

    </div>
  );
}

export default LoginPage;
