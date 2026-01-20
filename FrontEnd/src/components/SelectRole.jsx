import { useEffect, useState, useRef } from "react";
import { ChevronDown } from "lucide-react";


const SelectRole = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  const roles = [
    { label: "Admin", value: "admin" },
    { label: "Fleet Manager", value: "fleet_manager" },
    { label: "Driver", value: "driver" },
    { label: "Customer", value: "customer" },
  ];

  const selectedLabel = roles.find((role) => role.value === value)?.label || "Selected Role";

  const handleSelect = (role) => {
    onChange(role.value);
    setOpen(false);
  };
  

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);},[]);

  return (
    <div className="relative text-white " ref={boxRef}>
      
      {/* Box */}
      <div
      tabIndex={0}
        onClick={() => setOpen(!open)}
        className="w-full bg-transparent border border-gray-300 rounded-md py-2 px-3 
           cursor-pointer flex items-center justify-between 
           focus-within:border-blue-400 transition-all"
        >
        <span className="text-gray-400/70">
          {selectedLabel}
        </span>
        <ChevronDown className="text-white-800/40 " size={15} />
      </div>

      {/* Dropdown menu */}
      {open && (
        <div 
        className="absolute z-20 w-full mt-1 bg-white/2 backdrop-blur-[90px] border border-white/30 rounded-md shadow-lg backdrop-brightness-75"
        >
          {roles.map((role) => (
            <div
              key={role.value}
              className="px-3 py-2 hover:bg-white/40 cursor-pointer rounded-md"
              onClick={() => handleSelect(role)}
            >
              {role.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectRole;
