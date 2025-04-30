"use client";
import { useState } from "react";
import { signIn, confirmSignIn } from "aws-amplify/auth";

function useAuth() {
  const [userChallenge, setUserChallenge] = useState<any>("");
  const [requireNextStep, setRequireNextStep] = useState(false);
  const [error, setError] = useState("");
  const [requestParameters, setRequestParameters] = useState<string[]>([]);

  async function login(formData: { [name: string]: string }) {
    try {
      const response = await signIn({
        username: formData.username,
        password: formData.password,
      });
      if (
        "nextStep" in response &&
        response.nextStep.signInStep ===
          "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
      ) {
        if (response.nextStep?.missingAttributes) {
          //Add in the request parameters if needed
          setRequestParameters(response.nextStep?.missingAttributes);
        }

        setError("You require a new password");
        setRequireNextStep(true);
        setUserChallenge(response);
      }
      return response;
    } catch (error: any) {
      setError(error.message || "Failed to login");
    }
  }

  async function handleChallenge(
    payload: { [name: string]: string },
    password: string
  ) {
    try {
      console.log(payload);

      //If there isn't a user being challenged that means there isn't a session
      if (!userChallenge) {
        throw new Error("No User Session");
      } else {
        const result = await confirmSignIn({
          challengeResponse: password,
          options: {
            userAttributes: payload,
          },
        });
        console.log("Result = ", result);
        return result;
      }
    } catch (error: any) {
      setError(error.message || "Failed reseting a new password");
    }
  }
  return {
    login,
    handleChallenge,
    requireNextStep,
    requestParameters,
    error,
  };
}

export { useAuth };
