"use client";

import { useEffect, useState } from "react";

import {
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

import { auth, db } from "../lib/firebase";

import { useRouter } from "next/navigation";

export default function DashboardPage() {

  const router = useRouter();

  const [userEmail, setUserEmail] = useState("");

  const [tattooName, setTattooName] = useState("");
  const [artist, setArtist] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const [bookingStatus, setBookingStatus] =
    useState("NO BOOKING");

  const [bookingHistory, setBookingHistory] =
    useState<any[]>([]);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {

        if (!user) {

          router.push("/");

        } else {

          setUserEmail(user.email || "");

          const q = query(
            collection(db, "bookings"),
            where("email", "==", user.email)
          );

          onSnapshot(q, (snapshot) => {

            const historyData: any[] = [];

            snapshot.forEach((doc) => {

              const data = doc.data();

              historyData.push(data);

              setBookingStatus(
                data.status || "PENDING"
              );
            });

            setBookingHistory(historyData);
          });
        }
      }
    );

    return () => unsubscribe();

  }, []);

  const handleLogout = async () => {

    await signOut(auth);

    router.push("/");
  };

  const handleBooking = async () => {

    try {

      await addDoc(collection(db, "bookings"), {
        email: userEmail,
        whatsapp,
        tattooName,
        artist,
        date,
        notes,

        status: "PENDING",

        createdAt: new Date(),
      });

      alert("BOOKING SAVED 🔥");

      setTattooName("");
      setArtist("");
      setDate("");
      setNotes("");
      setWhatsapp("");

    } catch (error: any) {

      console.error(error);

      alert(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">

        <div>

          <h1 className="text-5xl font-black text-yellow-400 tracking-[8px]">
            BAXTER
          </h1>

          <p className="text-zinc-500 tracking-[4px] mt-2">
            CLIENT DASHBOARD
          </p>

        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-400 px-6 py-3 rounded-xl font-bold transition"
        >
          LOGOUT
        </button>

      </div>

      {/* WELCOME */}
      <section className="mt-16">

        <h2 className="text-4xl font-black">

          Welcome Back,

          <span className="text-red-500">
            {" "}{userEmail}
          </span>

        </h2>

        <p className="text-zinc-500 mt-4">
          Book your next tattoo session below.
        </p>

      </section>

      {/* BOOKING FORM */}
      <section className="mt-16 bg-zinc-950 border border-zinc-800 rounded-3xl p-8">

        <h3 className="text-3xl font-black text-yellow-400">
          NEW BOOKING
        </h3>

        {/* TATTOO NAME */}
        <input
          type="text"
          placeholder="Tattoo Name"
          value={tattooName}
          onChange={(e) => setTattooName(e.target.value)}
          className="w-full mt-8 bg-black border border-zinc-700 rounded-xl px-6 py-4 outline-none"
        />

        {/* WHATSAPP */}
        <input
          type="text"
          placeholder="WhatsApp Number"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="w-full mt-6 bg-black border border-zinc-700 rounded-xl px-6 py-4 outline-none"
        />

        {/* ARTIST */}
        <select
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className="w-full mt-6 bg-black border border-zinc-700 rounded-xl px-6 py-4 outline-none"
        >

          <option value="">
            Select Artist
          </option>

          <option value="Ryuuji">
            Ryuuji
          </option>

          <option value="Hanzo">
            Hanzo
          </option>

          <option value="Takeda">
            Takeda
          </option>

        </select>

        {/* DATE */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full mt-6 bg-black border border-zinc-700 rounded-xl px-6 py-4 outline-none"
        />

        {/* NOTES */}
        <textarea
          placeholder="Tattoo Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full mt-6 bg-black border border-zinc-700 rounded-xl px-6 py-4 outline-none h-32"
        />

        {/* BUTTON */}
        <button
          onClick={handleBooking}
          className="w-full mt-8 bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-xl font-black transition"
        >
          SAVE BOOKING
        </button>

      </section>

      {/* LIVE STATUS */}
      <section className="mt-16">

        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8">

          <p className="text-zinc-500 tracking-[3px]">
            CURRENT STATUS
          </p>

          <h3 className="text-5xl font-black text-yellow-400 mt-4">
            {bookingStatus}
          </h3>

          <p className="text-zinc-500 mt-4">
            Live booking status from admin panel.
          </p>

        </div>

      </section>

      {/* HISTORY */}
      <section className="mt-16">

        <h3 className="text-4xl font-black mb-8">
          BOOKING HISTORY
        </h3>

        <div className="space-y-6">

          {bookingHistory.map((booking, index) => (

            <div
              key={index}
              className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6"
            >

              <div className="flex items-center justify-between">

                <div>

                  <h4 className="text-2xl font-bold text-yellow-400">
                    {booking.tattooName}
                  </h4>

                  <p className="text-zinc-500 mt-2">
                    Artist: {booking.artist}
                  </p>

                  <p className="text-zinc-500 mt-2">
                    Date: {booking.date}
                  </p>

                  <p className="text-zinc-500 mt-2">
                    WhatsApp: {booking.whatsapp}
                  </p>

                </div>

                <div className="text-right">

                  <p className="text-zinc-500">
                    STATUS
                  </p>

                  <h3 className="text-2xl font-black text-red-500 mt-2">
                    {booking.status}
                  </h3>

                </div>

              </div>

              <div className="mt-6">

                <p className="text-zinc-500">
                  NOTES
                </p>

                <p className="mt-2 text-zinc-300">
                  {booking.notes}
                </p>

              </div>

            </div>
          ))}

        </div>

      </section>

    </main>
  );
}