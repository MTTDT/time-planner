"use client"
import Image from "next/image";
import DayCard from "./components/DayCard"
import { Calendar } from "@heroui/react";

export default function Home() {
  return (
    <div>
   
  <Calendar/>
  <DayCard/>
  </div>
);
}
