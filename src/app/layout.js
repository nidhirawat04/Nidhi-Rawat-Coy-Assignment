
import "./globals.css";

export const metadata = {
  title: "Coy | Discover",
  description: "Discover people and find mutual connections."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
