import axios from "axios";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function EditModal({
  open,
  setOpen,
  editRecord,
  setEditRecord,
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const obj = Object.fromEntries(data);

    try {
      setIsProcessing(true);
      const response = await axios.patch(
        `http://localhost:3001/datarecord/${editRecord.id}`,
        obj
      );
      if (response) {
        toast.success("Update Success!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      setIsProcessing(false);
      setOpen(undefined);
      setEditRecord({});
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal
        show={open === "form-elements"}
        size="md"
        popup
        onClose={() => {
          setOpen(undefined);
          setEditRecord({});
        }}
      >
        <Modal.Header />
        <Modal.Body>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Edit Record
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="title" value="Title" />
              </div>
              <TextInput
                id="title"
                name="title"
                placeholder="Secrets of Horizan"
                required
                defaultValue={editRecord.title}
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
                defaultValue={editRecord.content}
                placeholder="Content of your record"
                required
                shadow
                type="text"
              />
            </div>
            <Button isProcessing={isProcessing} type="submit">
              Update Record
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
