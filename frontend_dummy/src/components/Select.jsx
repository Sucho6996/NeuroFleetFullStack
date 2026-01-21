import { useEffect, useState, useRef } from "react";
import { ChevronDown } from "lucide-react";

const Select = ({ value, onChange, options, placeholder = "Select an option" }) => {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  const selectedLabel = options.find((option) => option.value === value)?.label || placeholder;

  const handleSelect = (option) => {
    onChange(option.value);
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative text-slate-900" ref={boxRef}>
      {/* Box */}
      <div
        tabIndex={0}
        onClick={() => setOpen(!open)}
        className="w-full bg-white/90 border border-slate-200 rounded-lg py-2.5 px-3.5 
           cursor-pointer flex items-center justify-between shadow-xs
           focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/60 transition"
      >
        <span className={`text-sm ${value ? "text-slate-900" : "text-slate-400"}`}>
          {selectedLabel}
        </span>
        <ChevronDown className="text-slate-400" size={16} />
      </div>

      {/* Dropdown menu */}
      {open && (
        <div 
          className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden"
        >
          {options.map((option) => (
            <div
              key={option.value}
              className="px-3.5 py-2.5 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;

