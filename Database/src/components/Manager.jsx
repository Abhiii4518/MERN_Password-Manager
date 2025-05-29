import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Manager = () => {
  const passwordRef = useRef();
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let passwords = localStorage.getItem("passwords");
    if (passwords) {
      setPasswordArray(JSON.parse(passwords));
    }

    getPasswords(); // fetch from server
  }, []);

  const getPasswords = async () => {
    try {
      let req = await fetch("http://localhost:3000/");
      let passwords = await req.json();
      setPasswordArray(passwords);
    } catch (error) {
      console.error("Error fetching passwords:", error);
    }
  };

  const savePassword = async () => {
    if (
      form.site.length > 3 &&
      form.username.length > 3 &&
      form.password.length > 3
    ) {
      let id = form.id || uuidv4();

      if (form.id) {
        await fetch("http://localhost:3000/", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: form.id }),
        });

        setPasswordArray((prev) =>
          prev.filter((item) => item.id !== form.id)
        );
      }

      const newEntry = { ...form, id };

      await fetch("http://localhost:3000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });

      setPasswordArray((prev) => [...prev, newEntry]);
      localStorage.setItem("passwords", JSON.stringify([...passwordArray, newEntry]));
      setForm({ site: "", username: "", password: "" });

      toast("Password saved!!!", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    } else {
      toast("Error: All fields must be at least 4 characters long.", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    }
  };

  const editPassword = (id) => {
    const passwordToEdit = passwordArray.find((item) => item.id === id);
    if (passwordToEdit) {
      setForm(passwordToEdit);
    }
  };

  const deletePassword = async (id) => {
    let c = window.confirm("Do you really want to delete this password?");
    if (!c) return;

    await fetch("http://localhost:3000/", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const updated = passwordArray.filter((item) => item.id !== id);
    setPasswordArray(updated);
    localStorage.setItem("passwords", JSON.stringify(updated));

    toast("Password deleted!!!", {
      position: "top-right",
      autoClose: 3000,
      theme: "dark",
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <ToastContainer transition={Bounce} theme="dark" />
      <div className="p-10 mb-10 mycontainer min-h-[86vh]">
        <h1 className="text-4xl font-bold text-center">
          <span className="text-green-700">&lt;</span>
          Pass
          <span className="text-green-700">OP/&gt;</span>
        </h1>
        <p className="text-green-700 text-lg text-center">
          Your Own Password Manager
        </p>

        <div className="text-black flex flex-col p-4 gap-3 items-center">
          <input
            value={form.site}
            onChange={handleChange}
            placeholder="Enter Website URL"
            className="rounded-full border border-green-500 w-full py-1 p-4"
            type="text"
            name="site"
          />
          <div className="flex flex-col md:flex-row w-full justify-between gap-4">
            <input
              value={form.username}
              onChange={handleChange}
              placeholder="Enter Username"
              className="rounded-full border border-green-500 w-full py-1 p-4"
              type="text"
              name="username"
            />
            <div className="relative w-full">
              <input
                ref={passwordRef}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="rounded-full border border-green-500 w-full py-1 pl-4 pr-12"
                type={show ? "text" : "password"}
                name="password"
              />
              <span
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-700 w-5 text-center"
                onClick={() => setShow(!show)}
              >
                <i
                  className={`fa-solid ${show ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </span>
            </div>
          </div>
          <button
            onClick={savePassword}
            className="flex justify-center items-center gap-2 bg-green-400 rounded-full px-8 py-2 w-fit hover:bg-green-500 border border-green-900"
          >
            <lord-icon
              src="https://cdn.lordicon.com/efxgwrkc.json"
              trigger="hover"
            ></lord-icon>
            Save
          </button>
        </div>

        <div className="passwords">
          <h2 className="font-bold text-2xl py-4">Your Passwords</h2>
          {passwordArray.length === 0 ? (
            <div>No Passwords to Show...</div>
          ) : (
            <table className="table-auto w-full rounded-md overflow-hidden">
              <thead className="bg-green-800 text-white">
                <tr>
                  <th className="py-2 border border-black">Site</th>
                  <th className="py-2 border border-black">Username</th>
                  <th className="py-2 border border-black">Password</th>
                  <th className="py-2 border border-black">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-green-100">
                {passwordArray.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2 border border-black text-center">
                      <a href={item.site} target="_blank" rel="noreferrer">
                        {item.site}
                      </a>
                    </td>
                    <td className="py-2 border border-black text-center">
                      {item.username}
                    </td>
                    <td className="py-2 border border-black text-center">
                      {item.password}
                    </td>
                    <td className="py-2 border border-black text-center">
                      <span
                        className="cursor-pointer mx-2"
                        onClick={() => editPassword(item.id)}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </span>
                      <span
                        className="cursor-pointer mx-2"
                        onClick={() => deletePassword(item.id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
