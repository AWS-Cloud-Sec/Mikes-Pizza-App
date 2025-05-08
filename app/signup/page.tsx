"use client";

import React, { useState } from "react";
import Footer from "../components/Footer";
import { useUserContext } from "../context/userContext";
import { EmailEncoding } from "aws-cdk-lib/aws-ses-actions";
import { Key } from "aws-cdk-lib/aws-kms";
import { request } from "http";

export default function SignupPage() {
  const [formData, setFormData] = useState<{ [name: string]: string }>({
    username: "",
    password: "",
    phone_number: "",
    given_name: "",
    family_name: "",
    address: "",
    email: "",
  });
  const [confirmationCode, setConfirmationCode] = useState<string>("");
  const [fieldMessages, setFieldMessages] = useState<{
    [name: string]: string;
  }>({
    password: "",
    email: "",
    phonenumber: "",
  });
  const {
    handleSignUp,
    isLoggedIn,
    requireNextStep,
    userChallenge,
    requestParameters,
    error,
    handleConfirmSignUp,
  } = useUserContext();

  async function validateInput(event: React.FormEvent) {
    event.preventDefault();
    let flag = false;
    //Thank you chatgpt, I didnt really wanna learn regex...again
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    if (!passwordRegex.test(formData["password"])) {
      flag = true;
      setFieldMessages((prev) => ({
        ...prev,
        ["password"]:
          "Password must include uppercase, lowercase, number, special character, and be at least 8 characters",
      }));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      flag = true;
      setFieldMessages((prev) => ({
        ...prev,
        ["email"]: "Email format is not valid.",
      }));
    }

    //If no flag is rung attempt a sign up, else break out of function
    if (!flag) {
      const response = await handleSignUp(formData);
      console.log(response);
    }
  }

  async function handleOTP(event: React.FormEvent) {
    event.preventDefault();
    const response = await handleConfirmSignUp(formData, confirmationCode);
  }

  return (
    <>
      {!isLoggedIn ? (
        <div>
          <div className="flex flex-col items-center pt-10 bg-gray-100 pb-10 min-h-40%">
            <h1 className="text-2xl mb-6 p-5">Sign Up</h1>
            {!requireNextStep ? (
              <div>
                <form
                  className="flex flex-col items-center w-[500px]"
                  onSubmit={(event) => validateInput(event)}
                >
                  {Object.entries(formData).map(([key, value]) => (
                    <div className="items-center flex flex-col">
                      <div key={key} className="mb-2 self-center">
                        <input
                          name={key}
                          type={key === "password" ? "password" : "text"}
                          placeholder={key
                            .replace("_", " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                          value={value}
                          className="border p-2 rounded w-[300px] pl-5"
                          onChange={(event) =>
                            setFormData((prev) => ({
                              ...prev,
                              [key]: event.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="self-center">
                        {fieldMessages[key] && (
                          <p className="text-sm text-red-500 text-center pb-3">
                            {fieldMessages[key]}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  <button className="bg-blue-600 text-white rounded p-2 px-6 hover:bg-blue-700">
                    Sign Up
                  </button>
                </form>
                {error}
              </div>
            ) : (
              <div>
                <h1 className="text-2xl mb-6 p-5">
                  User requires another step
                </h1>
                {userChallenge == "CONFIRM_SIGN_UP" ? (
                  <div className="flex flex-col items-center pt-10 bg-gray-100 pb-10 min-h-screen">
                    <h2 className="text-xl mb-4 p-4">
                      Confirm sign up. Check your {requestParameters[1]} at{" "}
                      {requestParameters[0]}
                    </h2>
                    <form
                      onSubmit={(event) => {
                        handleOTP(event);
                      }}
                    >
                      <input
                        placeholder="Enter your OTP"
                        className="border p-2 rounded w-[300px] pl-5"
                        value={confirmationCode}
                        onChange={(event) => {
                          setConfirmationCode(event.target.value);
                        }}
                      ></input>
                      <button className="bg-blue-600 text-white rounded p-2 px-6 hover:bg-blue-700">
                        Confirm OTP
                      </button>
                    </form>
                  </div>
                ) : (
                  <div>
                    You're not supoosed to be here ngl, if you see this idk what
                    to tell you other than your challenge is {userChallenge}
                  </div>
                )}

                <form></form>
              </div>
            )}
          </div>
          <Footer />
        </div>
      ) : (
        <div>User logged in.</div>
      )}
    </>
  );
}
