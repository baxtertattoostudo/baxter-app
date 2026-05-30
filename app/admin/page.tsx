"use client";

import { useEffect, useState } from "react";

import {
  collection,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

import {
  onAuthStateChanged,
} from "firebase/auth";

import { auth, db } from "../lib/firebase";

export default function AdminPage() {

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const unsubscribeAuth =
      onAuthStateChanged(auth, (user) => {

        if (!user) {
          window.location.href = "/";
          return;
        }

        // GANTI EMAIL INI DENGAN EMAIL ADMIN KAMU
        if (
          user.email !== "abaxstertattoo@gmail.com"
        ) {
          alert("ACCESS DENIED");

          window.location.href =
            "/dashboard";

          return;
        }

        const unsubscribeBookings =
          onSnapshot(
            collection(db, "bookings"),
            (snapshot) => {

              const data: any[] = [];

              snapshot.forEach((docItem) => {

                data.push({
                  id: docItem.id,
                  ...docItem.data(),
                });
              });

              setBookings(data);
              setLoading(false);
            }
          );

        return () =>
          unsubscribeBookings();
      });

    return () =>
      unsubscribeAuth();

  }, []);

  const updateStatus = async (
    id: string,
    status: string
  ) => {

    try {

      const bookingRef = doc(
        db,
        "bookings",
        id
      );

      await updateDoc(
        bookingRef,
        {
          status,
        }
      );

    } catch (error: any) {

      alert(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">

      {/* HEADER */}
      <div className="border-b border-zinc-800 pb-6">

        <h1 className="text-5xl font-black text-yellow-400 tracking-[8px]">
          BAXTER
        </h1>

        <p className="text-zinc-500 tracking-[4px] mt-2">
          ADMIN PANEL
        </p>

      </div>

      <section className="mt-16">

        <h2 className="text-4xl font-black mb-10">
          CLIENT BOOKINGS
        </h2>

        {loading && (
          <p className="text-zinc-500">
            Loading bookings...
          </p>
        )}

        <div className="space-y-6">

          {bookings.map((booking) => (

            <div
              key={booking.id}
              className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8"
            >

              <div className="grid md:grid-cols-2 gap-6">

                <div>
                  <p className="text-zinc-500">
                    CLIENT EMAIL
                  </p>

                  <h3 className="text-xl font-bold mt-2">
                    {booking.email}
                  </h3>
                </div>

                <div>
                  <p className="text-zinc-500">
                    WHATSAPP
                  </p>

                  <h3 className="text-xl font-bold mt-2">
                    {booking.whatsapp}
                  </h3>
                </div>

                <div>
                  <p className="text-zinc-500">
                    TATTOO
                  </p>

                  <h3 className="text-xl font-bold mt-2 text-yellow-400">
                    {booking.tattooName}
                  </h3>
                </div>

                <div>
                  <p className="text-zinc-500">
                    ARTIST
                  </p>

                  <h3 className="text-xl font-bold mt-2">
                    {booking.artist}
                  </h3>
                </div>

                <div>
                  <p className="text-zinc-500">
                    DATE
                  </p>

                  <h3 className="text-xl font-bold mt-2">
                    {booking.date}
                  </h3>
                </div>

                <div>
                  <p className="text-zinc-500">
                    STATUS
                  </p>

                  <h3
                    className={`text-2xl font-black mt-2 ${
                      booking.status ===
                      "APPROVED"
                        ? "text-green-400"
                        : booking.status ===
                          "COMPLETED"
                        ? "text-yellow-400"
                        : booking.status ===
                          "REJECTED"
                        ? "text-red-500"
                        : "text-orange-400"
                    }`}
                  >
                    {booking.status}
                  </h3>
                </div>

                <div className="md:col-span-2">

                  <p className="text-zinc-500">
                    NOTES
                  </p>

                  <p className="mt-2 text-zinc-300">
                    {booking.notes}
                  </p>

                </div>

              </div>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-4 mt-10">

                <button
                  onClick={() =>
                    updateStatus(
                      booking.id,
                      "APPROVED"
                    )
                  }
                  className="bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-xl font-black"
                >
                  APPROVE
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      booking.id,
                      "REJECTED"
                    )
                  }
                  className="bg-red-500 hover:bg-red-400 px-6 py-3 rounded-xl font-black"
                >
                  REJECT
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      booking.id,
                      "COMPLETED"
                    )
                  }
                  className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-black"
                >
                  COMPLETE
                </button>

              </div>

            </div>
          ))}

        </div>

      </section>

    </main>
  );
}
