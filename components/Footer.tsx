export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto py-6 px-4 text-sm text-gray-600">
        © {new Date().getFullYear()} Growfinitys
      </div>
    </footer>
  );
}
