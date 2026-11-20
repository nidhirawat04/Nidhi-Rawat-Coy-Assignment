
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <Link href="/" className="logo">
          coy<span>.</span>
        </Link>
      </header>

      <section className="empty-state home-placeholder">
        <h1>Home</h1>
        <p>Your existing Coy experience will go here.</p>
        <Link href="/" className="primary-button">
          Explore Discover
        </Link>
      </section>

      <nav className="bottom-nav">
        <Link href="/home" className="nav-item active">
          <span>⌂</span>
          Home
        </Link>
        <Link href="/" className="nav-item">
          <span>♡</span>
          Discover
        </Link>
        <Link href="/matches" className="nav-item">
          <span>♥</span>
          Matches
        </Link>
      </nav>
    </main>
  );
}
