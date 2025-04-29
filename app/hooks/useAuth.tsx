"use client";
import { useState } from "react";
import { signIn, confirmSignIn } from "aws-amplify/auth";

function useAuth() {
  const [userChallenge, setUserChallenge] = useState<any>("");
  const [requireNewPassword, setRequireNewPassword] = useState(false);
  const [error, setError] = useState("");

  async function login(email: string, password: string) {
    try {
      const response = await signIn({
        username: email,
        password: password,
      });
      if (
        "nextStep" in response &&
        response.nextStep.signInStep ===
          "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
      ) {
        setError("You require a new password");
        setRequireNewPassword(true);
        setUserChallenge(response);
      }
      return response;
    } catch (error: any) {
      setError(error.message || "Failed to login");
    }
  }

  async function validateNewPassword(
    newPassword: string,
    confirmPassword: string
  ) {
    try {
      //First check if the passwords match
      if (newPassword != confirmPassword) {
        setError("Passwords do not match! Try again");
        return;
      }

      //If there isn't a user being challenged that means there isn't a session
      if (!userChallenge) {
        throw new Error("No User Session");
      } else {
        const result = await confirmSignIn({ challengeResponse: newPassword });
        console.log("Result = ", result);
      }
    } catch (error: any) {
      setError(error.message || "Failed reseting a new password");
    }
  }
  return { login, validateNewPassword, requireNewPassword, error };
}

export { useAuth };
