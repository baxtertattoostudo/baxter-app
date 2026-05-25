"use client";

import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../lib/firebase";

export default function AdminPage() {

  const [bookings, setBookings] = useState<any[]>([]);

  const fetchBookings = async () => {

    const querySnapshot = await getDocs(
      collection(db, "bookings")
    );

    const data: any[] = [];

    querySnapshot.forEach((docItem) => {

      data.push({
        id: docItem.id,
        ...docItem.data(),
      });
    });

    setBookings(data);
  };

  useEffect(() => {

    fetchBookings();

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

      await updateDoc(bookingRef, {
        status,
      });

      alert("STATUS UPDATED 🔥");

      fetchBookings();

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

      {/* BOOKINGS */}
      <section className="mt-16">

        <h2 className="text-4xl font-black mb-10">
          CLIENT BOOKINGS
        </h2>

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

                  <h3 className="text-2xl font-bold mt-2">
                    {booking.email}
                  </h3>
                </div>

                <div>
                  <p className="text-zinc-500">
                    WHATSAPP
                  </p>

                  <h3 className="text-2xl font-bold mt-2">
                    {booking.whatsapp}
                  </h3>
                </div>

                <div>
                  <p className="text-zinc-500">
                    TATTOO
                  </p>

                  <h3 className="text-2xl font-bold mt-2 text-yellow-400">
                    {booking.tattooName}
                  </h3>
                </div>

                <div>
                  <p className="text-zinc-500">
                    ARTIST
                  </p>

                  <h3 className="text-2xl font-bold mt-2">
                    {booking.artist}
                  </h3>
                </div>

                <div>
                  <p className="text-zinc-500">
                    DATE
                  </p>

                  <h3 className="text-2xl font-bold mt-2">
                    {booking.date}
                  </h3>
                </div>

                <div>
                  <p className="text-zinc-500">
                    STATUS
                  </p>

                  <h3 className="text-2xl font-black mt-2 text-red-500">
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

              {/* ACTION BUTTONS */}
              <div className="flex gap-4 mt-10">

                <button
                  onClick={() =>
                    updateStatus(
                      booking.id,
                      "APPROVED"
                    )
                  }
                  className="bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-xl font-black transition"
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
                  className="bg-red-500 hover:bg-red-400 px-6 py-3 rounded-xl font-black transition"
                >
                  REJECT
                </button>

              </div>

            </div>
          ))}

        </div>

      </section>

    </main>
  );
}