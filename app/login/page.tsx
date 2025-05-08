"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "aws-amplify/auth";
import { useAuth } from "../hooks/useAuth";
import { useUserContext } from "../context/userContext";

const LoginPage = () => {
  const router = useRouter();
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
        router.push('/menu');
      } catch (error: any) {
        console.log(error.message);
      }
    })();
  }, []);

  async function handleLogin(event: React.FormEvent) {
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
        setFormData((prev) => ({ ...prev, password: "" }));
      }
      if (response?.isSignedIn === true) {
        console.log("User logged in successfully");
        const user = await getCurrentUser();
        setCurrentUser(user);
        setIsLoggedIn(true);
        router.push('/menu');
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Login to Mike's Pizza</h1>
        {!requireNextStep ? (
          <form
            onSubmit={(event) => {
              handleLogin(event);
            }}
            className="flex flex-col gap-4"
          >
            <input
              type="text"
              placeholder="Username"
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData["username"]}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, username: e.target.value }))
              }
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData["password"]}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700 transition-colors"
            >
              Log In
            </button>
            {error && <p className="text-red-500 text-center">{error}</p>}
          </form>
        ) : (
          <form className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Password"
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData["password"]}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  password: event.target.value,
                }))
              }
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
              }}
            />
            <div className="text-center text-sm">
              {formData["password"] === confirmPassword
                ? "Passwords match!"
                : "Passwords do not match"}
            </div>
            <div className="space-y-2">
              {requestParameters?.map((attribute) => (
                <input
                  key={attribute}
                  type="text"
                  placeholder={attribute}
                  value={userAttributes[attribute]}
                  name={attribute}
                  onChange={(event) => handleUserAttributes(event)}
                  className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>
            <button
              className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700 transition-colors"
              onClick={(event) => handleChallengeEvent(event)}
            >
              Confirm Password
            </button>
            {error && <p className="text-red-500 text-center">{error}</p>}
            {requestParameters && requestParameters.length > 0 && (
              <div className="text-center text-sm text-gray-600">
                <p>Missing attributes:</p>
                <p>{requestParameters.join(", ")}</p>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
