import { useState } from "react";
import { Card, Button, Input, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
// import { SketchPicker } from "react-color";

const Reminder = ({ reminder, onSave }) => {
  const [title, setTitle] = useState(reminder?.title || "");
  const [startTime, setStartTime] = useState(reminder?.startTime || "");
  const [endTime, setEndTime] = useState(reminder?.endTime || "");
  const [description, setDescription] = useState(reminder?.description || "");
  const [color, setColor] = useState(reminder?.color || "#FF5733");

  return (
    <Card style={{ borderLeft: `5px solid ${color}` }}>
        <Input
          placeholder="Reminder title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div className="flex gap-2 mt-2">
          <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </div>
        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-2"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button className="mt-2" style={{ backgroundColor: color }}>Pick Color</Button>
          </PopoverTrigger>
          <PopoverContent>
            {/* <SketchPicker color={color} onChangeComplete={(c) => setColor(c.hex)} /> */}
          </PopoverContent>
        </Popover>
        <Button className="mt-2 w-full" onClick={() => onSave({ title, startTime, endTime, description, color })}>
          Save Reminder
        </Button>
    </Card>
  );
};

export default Reminder;