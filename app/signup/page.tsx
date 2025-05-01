"use client";

import React, { useState } from "react";
import Footer from "../components/Footer";
import { useUserContext } from "../context/userContext";
import { EmailEncoding } from "aws-cdk-lib/aws-ses-actions";

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState<{ [name: string]: string }>({
    username: "",
    password: "",
    phonenumber: "",
    given_name: "",
    family_name: "",
    address: "",
  });
  const [isPasswordValid, setIsPasswordValid] = useState("");
  const [isEmailValid, setIsEmailValid] = useState("");
  const [fieldMessages, setFieldMessages] = useState<{
    [name: string]: string;
  }>({
    password: "",
    email: "",
    phonenumber: "",
  });
  const { handleSignUp } = useUserContext();

  function validateInput(event: React.FormEvent) {
    event.preventDefault();
    //Thank you chatgpt, I didnt really wanna learn regex...again
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    if (!passwordRegex.test(formData["password"])) {
      setIsPasswordValid(
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character"
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setIsEmailValid("Please enter a valid email address.");
    }
  }

  return (
    <>
      <div className="flex justify-center flex-col items-center pt-10 bg-gray-100 pb-10">
        <h1 className="text-2xl mb-6  p-5">Sign Up</h1>

        <form
          className="flex justify-center flex-col items-center"
          onSubmit={(event) => validateInput(event)}
        >
          {Object.entries(formData).map(([key, value]) => (
            <input
              key={key}
              name={key}
              type={key === "password" ? "password" : "text"}
              placeholder={key
                .replace("_", " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
              value={value}
              className="border p-2 rounded w-50% mb-2"
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  [key]: event.target.value,
                }))
              }
            />
          ))}
          <button className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700">
            Sign Up
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default SignupPage;
