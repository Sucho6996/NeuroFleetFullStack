const ProfileSection = ({ title, children, editable = true }) => {
  return (
    <div className="bg-green-100 border border-green-400 rounded-xl p-6 space-y-4">
      
      {/* Header with title and optional edit button */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-green-800">
          {title}
        </h3>
        {editable && (
          <button className="text-xs text-green-600 hover:bg-green-200 px-3 py-1 rounded-md transition">
            Edit
          </button>
        )}
      </div>

      {/* Content */}
      <div className="text-sm text-slate-700">
        {children}
      </div>
    </div>
  );
};

export default ProfileSection;
