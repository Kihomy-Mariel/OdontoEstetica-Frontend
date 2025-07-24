const StatBox = ({ title, value, icon, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 hover:scale-[1.025] transition-all duration-200 px-7 py-8 flex flex-col items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
  >
    <div className="flex items-center gap-3 mb-1">
      <span className="font-semibold text-blue-800 text-lg">{title}</span>
      <span className="text-blue-400">{icon}</span>
    </div>
    <div className="text-4xl font-extrabold text-blue-500 drop-shadow">{value}</div>
  </button>
);

export default StatBox;
