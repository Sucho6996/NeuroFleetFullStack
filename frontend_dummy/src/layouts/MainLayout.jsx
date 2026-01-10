import TopNavbar from "../components/TopNavbar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopNavbar />
      <main className="pt-6">{children}</main>
    </div>
  );
};

export default MainLayout;
