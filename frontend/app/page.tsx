export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-white px-6">
      <div className="max-w-4xl text-center space-y-6">
        <h1 className="text-5xl md:text-7xl font-black text-[#0b1f3a] tracking-tight">
          Welcome to <br />
          <span className="text-blue-600 uppercase tracking-widest">Nskill India</span>
        </h1>
        <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
        <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
          Technical Skill Training & Corporate Consulting Excellence
        </p>
      </div>
    </div>
  );
}