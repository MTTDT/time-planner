"use client"

import { useState } from "react";
import { Button, Input, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { SketchPicker } from "react-color";
import Reminder from "./Reminder.jsx";

const DayCard = () => {
  const [title, setTitle] = useState("Day");
  const [color, setColor] = useState("#1976D2");
  const [reminders, setReminders] = useState([]);
  
  const addReminder = (reminder) => {
    setReminders([...reminders, reminder]);
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} className="text-xl font-bold" />
        <Popover>
          <PopoverTrigger asChild>
            <Button style={{ backgroundColor: color }}>Pick Color</Button>
          </PopoverTrigger>
          <PopoverContent>
            <SketchPicker color={color} onChangeComplete={(c) => setColor(c.hex)} />
          </PopoverContent>
        </Popover>
      </div>
      {/* <Reminder onSave={addReminder} /> */}
      <div className="mt-4">
        {reminders.map((reminder, index) => (
          <Reminder key={index} reminder={reminder} onSave={() => {}} />
        ))}
      </div>
    </div>
  );
};

export default DayCard;