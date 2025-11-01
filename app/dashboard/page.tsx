import LogoutBar from "@/components/LogoutBar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-gold flex flex-col items-center justify-center relative">
      <LogoutBar />
      <h1 className="text-4xl font-bold mb-4">Welcome to Growfinitys VIP Dashboard</h1>
      <p className="text-lg text-gray-300">Exclusive signals coming soon!</p>
    </div>
  );
}
