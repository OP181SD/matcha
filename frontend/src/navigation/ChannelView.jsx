import { Navbar } from "../component/profil/Navbar.jsx";

export const ChannelView  = () => {
  return (
    <div className="w-full py-4 px-6 gap-2">
      <Navbar />
      <div className="flex justify-between items-center min-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-pen md:text-3xl lg:text-4xl">
          message ds <span className="text-pink">伝</span><span className="text-tea">言</span>
        </h1>
      </div>
    </div>
  );
};