const ProfileField = ({ label, value }) => (
  <div className="flex flex-col mb-1">
    <span className="text-xs font-semibold text-blue-400">{label}</span>
    <span className="text-sm font-medium text-blue-900">{value}</span>
  </div>
);

export default ProfileField;
