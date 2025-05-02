"use client";
import { useState } from "react";
import {
  signIn,
  confirmSignIn,
  getCurrentUser,
  AuthUser,
  signUp,
  confirmSignUp,
} from "aws-amplify/auth";
import { UserPoolIdentityProviderAmazon } from "aws-cdk-lib/aws-cognito";

function useAuth() {
  const [userChallenge, setUserChallenge] = useState<any>("");
  const [requireNextStep, setRequireNextStep] = useState(false);
  const [error, setError] = useState("");
  const [requestParameters, setRequestParameters] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  async function handleConfirmSignUp(
    formData: { [name: string]: string },
    confirmationCode: string
  ) {
    try {
      console.log("Before response");
      const response = await confirmSignUp({
        username: formData.username,
        confirmationCode: confirmationCode,
      });

      if (response.isSignUpComplete) {
        //Sign in the user right after confirmation
        const signInResponse = await signIn({
          username: formData.username,
          password: formData.password,
        });

        if (signInResponse.isSignedIn) {
          const user = await getCurrentUser();
          setCurrentUser(user); //Sets your user context
          setIsLoggedIn(true);
        }
      }
      return response;
    } catch (error: any) {
      console.log(error.message);
    }
  }
  async function handleSignUp(formData: { [name: string]: string }) {
    try {
      const response = await signUp({
        username: formData.username,
        password: formData.password,
        options: {
          userAttributes: {
            email: formData.email,
            given_name: formData.given_name,
            family_name: formData.family_name,
            address: formData.address,
            phone_number: formData.phone_number,
          },
        },
      });

      if (
        response &&
        response.isSignUpComplete == false &&
        response.nextStep.signUpStep === "CONFIRM_SIGN_UP"
      ) {
        const {
          destination = "",
          deliveryMedium = "",
          attributeName = "",
        } = response.nextStep.codeDeliveryDetails;
        setRequireNextStep(true);
        setUserChallenge(response.nextStep.signUpStep);
        setRequestParameters([destination, deliveryMedium, attributeName]);
        return response;
      }
      return response;
    } catch (error: any) {
      setError(error.message);
      console.log(error);
    }
  }

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
      if (response.isSignedIn === true) {
        const user = await getCurrentUser();
        console.log(user);
        setCurrentUser(user);
        setIsLoggedIn(true);
      }
      return response;
    } catch (error: any) {
      if (error.message === "There is already a signed in user.") {
        const user = await getCurrentUser();
        console.log(user);
        setCurrentUser(user);
        setIsLoggedIn(true);
      }
      console.log(error);
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
        if (result.isSignedIn === true) {
          setIsLoggedIn(true);
          const user = await getCurrentUser();
          setCurrentUser(user);
        }

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
    currentUser,
    setCurrentUser,
    isLoggedIn,
    setIsLoggedIn,
    handleSignUp,
    userChallenge,
    handleConfirmSignUp,
  };
}

export { useAuth };
