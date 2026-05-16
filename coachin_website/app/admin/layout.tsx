import AdminSidebar from "./component/adminsidebar";
import AdminHeader from "./component/adminheader";

export default function AdminLayout({ children  } : { children: React.ReactNode }) {
  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css" />
    <div className="flex min-h-screen bg-base-content overflow-hidden">

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* RIGHT CONTENT */}
      <div className="flex-1 flex flex-col">

        {/* ADMIN HEADER */}
        <AdminHeader />

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
    </>
  );
}