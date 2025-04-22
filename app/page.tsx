"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./globals.css";
// import { generateClient } from "aws-amplify/data";
// import type { Schema } from "@/amplify/data/resource";
// import { Amplify } from "aws-amplify";
// import outputs from "@/amplify_outputs.json";

// import "@aws-amplify/ui-react/styles.css";

// Amplify.configure(outputs);
// const client = generateClient<Schema>();

export default function App() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    const redirect = async () => {
      await router.push("/home");
      setIsRedirecting(false);
    };
    redirect();
  }, [router]);

  if (isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return null;
}

