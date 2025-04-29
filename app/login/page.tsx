"use client";
import React, { FormEvent, useState } from "react";
import "../styles/login.css";
import { signIn } from "aws-amplify/auth";
import { useAuth } from "../hooks/useAuth";
import { Amplify } from "aws-amplify";
import awsExports from "../awsExports";
import { setRequestMeta } from "next/dist/server/request-meta";

Amplify.configure(awsExports);

const LoginPage = () => {
  //Custom hook to help message login
  const { login, validateNewPassword, requireNewPassword, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  async function handleLogin(event: React.FormEvent) {
    //Prevents page from refreshing
    event.preventDefault();
    try {
      const response = await login(email, password);
      console.log(response);
      console.log(error);
    } catch (error: any) {
      console.log(error.message || "Failed to login");
    }
  }
  async function handleNewPassword(event: React.FocusEvent) {
    event.preventDefault();
    try {
      const response = await validateNewPassword(password, confirmPassword);
    } catch (error: any) {
      console.log(error.message || "Error while trying validate new password");
    }
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="bg-gray-100">
        <h1 className="text-2xl mb-6 color:">Login to Mike's Pizza</h1>

        {!requireNewPassword ? (
          <form
            onSubmit={(event) => {
              handleLogin(event);
            }}
            className="flex flex-col gap-4 w-full max-w-xs"
          >
            <input
              type="email"
              placeholder="Email"
              className="border p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="border p-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
              onClick={(event) => {
                handleLogin(event);
              }}
            >
              Log In
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        ) : (
          <form className="flex flex-col gap-4 w-full max-w-xs">
            <input
              type="password"
              placeholder="Password"
              className="border p-2 rounded"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            ></input>
            <input
              type="password"
              placeholder="Confirm Password"
              className="border p-2 rounded"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
              }}
            ></input>
            <button
              className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
              onClick={(event) => {
                handleNewPassword(event);
              }}
            >
              Confirm Password
            </button>
            {<p className="text-red-500">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
};
export default LoginPage;
