"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "./lib/firebase";

export default function BaxterIrezumiApp() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {

      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("ACCOUNT CREATED 🔥");

    } catch (error: any) {

      alert(error.message);
    }
  };

  const handleLogin = async () => {
    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      router.push("/dashboard");

    } catch (error: any) {

      alert(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">

      <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-3xl p-10">

        <h1 className="text-5xl font-black text-yellow-400 tracking-[6px] text-center">
          BAXTER
        </h1>

        <p className="text-center text-zinc-500 mt-4 tracking-[3px]">
          IREZUMI BOOKING SYSTEM
        </p>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-10 bg-black border border-zinc-700 rounded-xl px-6 py-4 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mt-6 bg-black border border-zinc-700 rounded-xl px-6 py-4 outline-none"
        />

        <div className="grid grid-cols-2 gap-4 mt-8">

          <button
            onClick={handleRegister}
            className="bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-xl font-black transition"
          >
            REGISTER
          </button>

          <button
            onClick={handleLogin}
            className="bg-red-500 hover:bg-red-400 py-4 rounded-xl font-black transition"
          >
            LOGIN
          </button>

        </div>

      </div>

    </main>
  );
}