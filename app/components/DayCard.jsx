"use client"
import React from "react";
import { Card } from "@heroui/react";

const DayCard = ({day}) => {
    return(
    <Card className="px-4 pb-8 pt-3 w-fit">
        <p className="text-4xl">DAY {day}</p>
        <p>Some note</p>
        <p>Some note</p>
    </Card>
    )
}
export default DayCard;
