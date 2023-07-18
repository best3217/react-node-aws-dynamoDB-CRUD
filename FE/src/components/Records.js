import React, { useState, useEffect } from "react";
import { Button, Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import EditModal from "./EditModal";

const Records = ({ socket }) => {
  const [data, setData] = useState([]);
  const [editRecord, setEditRecord] = useState({});
  const [open, setOpen] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/datarecord");
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    function onNewData(record) {
      setData([...data, ...record]);
    }

    function onUpdateData(record) {
      let updatedData = data.map((item) => {
        if (item.id === record.id) {
          return record;
        }
        return item;
      });
      setData(updatedData);
    }

    function onDeleteData(recordId) {
      const updatedData = data.filter((record) => record.id !== recordId);
      setData(updatedData);
    }

    socket.on("sync", onNewData);
    socket.on("update", onUpdateData);
    socket.on("delete", onDeleteData);

    return () => {
      socket.off("sync", onNewData);
      socket.off("update", onUpdateData);
      socket.off("delete", onDeleteData);
    };
  }, [socket, data]);

  const handleDelete = async (recordId) => {
    try {
      await axios.delete(`http://localhost:3001/datarecord/${recordId}`);
      toast.warning("Deleted!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.log(error);
    }
  };
  if (data.length <= 0) {
    return (
      <div className="min-w-[75vw] min-h-[75vh] flex justify-center mx-auto align-middle items-center">
        <Spinner aria-label="Default status example" size="xl" />
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between px-20 py-4">
        <h2 className="text-2xl font-bold">Records</h2>
        <Button onClick={() => navigate("/create")}>Create</Button>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                id
              </th>
              <th scope="col" className="px-6 py-3">
                title
              </th>
              <th scope="col" className="px-6 py-3">
                content
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((record) => {
              return (
                <tr
                  key={record.id}
                  className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {record.id}
                  </th>
                  <td className="px-6 py-4">{record.title}</td>
                  <td className="px-6 py-4">{record.content}</td>
                  <td className="px-6 py-4 flex flex-wrap items-center gap-2">
                    <Button
                      size="xs"
                      onClick={() => {
                        setOpen("form-elements");
                        setEditRecord(record);
                      }}
                      pill
                    >
                      Edit
                    </Button>
                    <Button
                      size="xs"
                      key={record.id}
                      color="failure"
                      pill
                      onClick={(e) => {
                        handleDelete(record.id);
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <EditModal
        open={open}
        setOpen={setOpen}
        editRecord={editRecord}
        setEditRecord={setEditRecord}
      />
    </div>
  );
};

export default Records;
