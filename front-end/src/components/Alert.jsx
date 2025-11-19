import { useState } from "react";

const Alert = ({ type, message }) => {
  const [show, setShow] = useState(true);

  if (!show) return null;

  const color = type === "error" ? "bg-red-100 text-red-700 border-red-300" : "bg-green-100 text-green-700 border-green-300";

  return (
    <div className={`border p-3 rounded-lg mb-3 text-sm font-medium flex justify-between items-start ${color}`}>
      <span>{message}</span>

      {/* tombol close */}
      <button className="ml-3 text-xl leading-none hover:opacity-70" onClick={() => setShow(false)}>
        ✕
      </button>
    </div>
  );
};

export default Alert;
