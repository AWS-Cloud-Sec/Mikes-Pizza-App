"use client";
import React, { useState, useEffect } from "react";

import { getCurrentUser } from "aws-amplify/auth";
import { useAuth } from "../hooks/useAuth";

import Footer from "../components/Footer";
import { useUserContext } from "../context/userContext";

const LoginPage = () => {
  //Custom hook to help message login
  const {
    login,
    handleChallenge,
    requireNextStep,
    error,
    requestParameters,
    setCurrentUser,
    isLoggedIn,
    setIsLoggedIn,
  } = useUserContext();
  const [formData, setFormData] = useState<{ [name: string]: string }>({
    username: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userAttributes, setUserAttributes] = useState<{
    [name: string]: string;
  }>({});
  useEffect(() => {
    setCurrentUser(undefined);
    setIsLoggedIn(false);
    setFormData({ username: "", password: "" });
    setConfirmPassword("");
    setUserAttributes({});
    (async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
        setIsLoggedIn(true);
      } catch (error: any) {
        console.log(error.message);
      }
    })();
  }, []);

  //handleLogin invokes signIn() to sign into cognito
  //In the case that the user needs to do another step(MFA,new password fromtemp, etc.
  //Resposne returns it back back in it's nextStep object
  async function handleLogin(event: React.FormEvent) {
    //Prevents page from refreshing
    event.preventDefault();
    try {
      const response = await login(formData);
      console.log(response);
      if (
        response &&
        "nextStep" in response &&
        response.nextStep?.signInStep ===
          "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
      ) {
        //Clear password
        setFormData((prev) => ({ ...prev, password: "" }));
      }
      if (response?.isSignedIn === true) {
        console.log("User logged in sucessfully");
        const user = await getCurrentUser();
        setCurrentUser(user);
        setIsLoggedIn(true);
      }
    } catch (error: any) {
      console.log(error.message || "Failed to login");
    }
  }

  async function handleChallengeEvent(event: React.FormEvent) {
    event.preventDefault();
    try {
      const response = await handleChallenge(userAttributes, confirmPassword);
      console.log("Handle challenge event Response: ", response);
    } catch (error: any) {
      console.log(error.message || "Error while trying validate new password");
    }
  }

  function handleUserAttributes(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    console.log(name, value);
    setUserAttributes((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
        <div className="bg-gray-100">
          <h1 className="text-2xl mb-6 color:">Login to Mike's Pizza</h1>
          {isLoggedIn ? (
            "User is already logged in!"
          ) : !requireNextStep ? (
            <form
              onSubmit={(event) => {
                handleLogin(event);
              }}
              className="flex flex-col gap-4 w-full max-w-xs"
            >
              <input
                type="text"
                placeholder="Username"
                className="border p-2 rounded"
                value={formData["username"]}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, username: e.target.value }))
                }
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="border p-2 rounded"
                value={formData["password"]}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
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
                value={formData["password"]}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
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
              <div>
                {formData["password"] == confirmPassword
                  ? "Passwords match!"
                  : "Passwords do not match"}
              </div>
              <div>
                {requestParameters &&
                  requestParameters.length > 0 &&
                  requestParameters.map((attribute) => (
                    <input
                      key={attribute}
                      type="text"
                      placeholder={attribute}
                      value={userAttributes[attribute]}
                      name={attribute}
                      onChange={(event) => {
                        handleUserAttributes(event);
                      }}
                      className="border p-2 rounded w-full mb-2"
                    />
                  ))}
              </div>
              <button
                className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
                onClick={(event) => {
                  handleChallengeEvent(event);
                }}
              >
                Confirm Password
              </button>
              {
                <>
                  <p className="text-red-500">{error}</p>
                  <p>Also missing attributes:</p>
                  <p>{requestParameters}</p>
                </>
              }
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};
export default LoginPage;
