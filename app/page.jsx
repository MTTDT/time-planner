"use client"
import Image from "next/image";
import DayCard from "./components/DayCard"
import { Calendar } from "@heroui/react";

export default function Home() {
  return (
    // <div className="grid grid-cols-6 gap-6">
    //   {
    //     Array.from({ length: 30 }, (_, i) => (
    //       <DayCard key={i} day={i+1} />
    //     ))
    //   }
    // </div>
  <Calendar/>
);
}
