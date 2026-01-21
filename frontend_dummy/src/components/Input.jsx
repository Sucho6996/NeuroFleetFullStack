import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const Input = ({label, value, onChange, placeholder, type}) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    return (
        <div className="mb-4">
            <label className="block mb-1.5 text-[13px] font-medium text-slate-700">
                {label}
            </label>
            <div className="relative">
                <input 
                    className="w-full bg-white/90 border border-slate-200 rounded-lg py-2.5 px-3.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-500 transition"
                    type={type === 'password'? (showPassword ? 'text' : 'password') : type} 
                    placeholder={placeholder} 
                    value={value}
                    onChange={(e) => onChange(e)} />

                {type === 'password' && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                        {showPassword ? (
                            <Eye
                            size={18}
                            className='text-emerald-600'
                            onClick={toggleShowPassword}
                            />
                        ):(
                            <EyeOff
                            size={18}
                            className='text-slate-400'
                            onClick={toggleShowPassword}
                            />
                        )}
                    </span>
                )}
            </div>
        </div>
    )
}

export default Input;