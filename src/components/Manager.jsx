import { stringify } from "postcss";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Manager = () => {
  const ref = useRef();
  const passwordRef = useRef();
  const [form, setform] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setpasswordArray] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let passwords = localStorage.getItem("passwords");
    if (passwords) {
      setpasswordArray(JSON.parse(passwords));
    }
  }, []);

  const showPassword = () => {
    passwordRef.current.type = "text";
    if (ref.current.classList.contains("fa-eye")) {
      ref.current.classList.remove("fa-eye");
      ref.current.classList.add("fa-eye-slash");
      passwordRef.current.type = "password";
    } else {
      passwordRef.current.type = "text";
      ref.current.classList.remove("fa-eye-slash");
      ref.current.classList.add("fa-eye");
    }
  };

  const savePassword = () => {
    toast("Password saved!!!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    setpasswordArray([...passwordArray, { ...form, id: uuidv4() }]);
    localStorage.setItem(
      "passwords",
      JSON.stringify([...passwordArray, { ...form, id: uuidv4() }])
    );
    console.log([...passwordArray, form]);
    setform({ site: "", username: "", password: "" });
  };

  const editPassword = (id) => {
    console.log("Editing password with id", id);
    const passwordToEdit = passwordArray.find((item) => item.id === id);
    if (passwordToEdit) {
      setform(passwordToEdit);
      setpasswordArray(passwordArray.filter((item) => item.id !== id));
    }
  };

  const deletePassword = (id) => {
    toast("Password deleted!!!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    console.log("Deleting password with id", id);
    let c = confirm("Do you really want to Delete");
    if (c) {
      setpasswordArray(passwordArray.filter((item) => item.id !== id));
      localStorage.setItem(
        "passwords",
        JSON.stringify(passwordArray.filter((item) => item.id !== id))
      );
    }
  };

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      ;
      <div className="absolute -z-10 bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(173,109,244,0.5)] opacity-50 blur-[80px]">
        <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-green-50 opacity-50 blur-[80px]"></div>
      </div>
      <div className="p-10 mb-10 mycontainer min-h-[86vh]">
        <h1 className="text-4xl font-bold text-center">
          <span className="text-green-700">&lt;</span>
          Pass
          <span className="text-green-700">OP/&gt;</span>
        </h1>
        <p className="text-green-700 text-lg text-center ">
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
            id="site"
          />
          <div className="flex flex-col md:flex-row w-full justify-between gap-4">
            <input
              value={form.username}
              onChange={handleChange}
              placeholder="Enter Username"
              className="rounded-full border border-green-500 w-full py-1 p-4"
              type="text"
              name="username"
              id="username"
            />
            <div className="relative w-full">
              <input
                ref={passwordRef}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="rounded-full border border-green-500 w-full py-1 p-4 pr-12"
                type={show ? "text" : "password"}
                name="password"
                id="password"
              />
              <span
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-700"
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
          {passwordArray.length === 0 && <div>No Passwords to Show...</div>}
          {passwordArray.length != 0 && (
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
                {passwordArray.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="py-2 border border-black text-center">
                        <a href={item.site} target="_blank">
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
                          onClick={() => {
                            editPassword(item.id);
                          }}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </span>
                        <span
                          className="cursor-pointer mx-2"
                          onClick={() => {
                            deletePassword(item.id);
                          }}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
