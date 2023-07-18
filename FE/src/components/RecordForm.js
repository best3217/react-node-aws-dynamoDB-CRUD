"use client";

import axios from "axios";
import { Button, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function RecordForm() {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);
    const data = new FormData(event.currentTarget);
    const obj = [Object.fromEntries(data)];

    try {
      const response = await axios.post(
        "http://localhost:3001/datarecord",
        obj
      );
      if (response) {
        toast.success("Success!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        navigate("/");
      }
      setIsProcessing(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="title" value="Title" />
        </div>
        <TextInput
          id="title"
          name="title"
          placeholder="Secrets of Horizan"
          required
          shadow
          type="text"
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="content" value="content" />
        </div>
        <TextInput
          id="content"
          name="content"
          placeholder="Content of your record"
          required
          shadow
          type="text"
        />
      </div>
      <Button isProcessing={isProcessing} type="submit">
        Create Record
      </Button>
    </form>
  );
}
