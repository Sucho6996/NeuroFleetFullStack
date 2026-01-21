import { useState } from "react";
import { X } from "lucide-react";

const AddAlertModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    regNo: "",
    issue: "",
    actionNeeded: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Backend-ready payload matching AlertTable model
    const payload = {
      regNo: form.regNo.trim(),
      issue: form.issue.trim(),
      actionNeeded: form.actionNeeded.trim(),
    };

    onAdd(payload);

    // Reset form
    setForm({
      regNo: "",
      issue: "",
      actionNeeded: "",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 relative shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-600 hover:text-slate-900"
        >
          <X size={18} />
        </button>

        <h3 className="text-lg font-semibold mb-4 text-slate-900">
          Add New Alert
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Vehicle Registration Number
            </label>
            <input
              name="regNo"
              placeholder="e.g., MH-12-AB-1234"
              required
              value={form.regNo}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Issue Description
            </label>
            <textarea
              name="issue"
              placeholder="Describe the issue (e.g., Engine overheating, Low fuel, Brake warning)"
              required
              value={form.issue}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Action Needed
            </label>
            <textarea
              name="actionNeeded"
              placeholder="Describe the required action (e.g., Immediate inspection needed, Schedule maintenance, Refuel required)"
              required
              value={form.actionNeeded}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 py-2 rounded-lg transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition font-medium"
            >
              Add Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAlertModal;

