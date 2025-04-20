// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-primary text-white p-4 mt-10 text-center">
      <p>
        &copy; {new Date().getFullYear()} dotaloregasm.com. All rights reserved.
      </p>
    </footer>
  );
}
