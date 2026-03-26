import { SignIn } from "@clerk/react";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <SignIn />
      </div>
    </div>
  );
}