
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const response = await fetch("/api/matches");
        const data = await response.json();
        setMatches(data.matches || []);
      } catch (error) {
        console.error("Unable to load matches", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, []);

  return (
    <main className="app-shell">
      <header className="topbar">
        <Link href="/" className="logo">
          coy<span>.</span>
        </Link>
        <span className="matches-total">{matches.length} matches</span>
      </header>

      <section className="matches-content">
        <p className="eyebrow">MUTUAL CONNECTIONS</p>
        <h1>Your matches</h1>
        <p className="subtitle">
          People who liked you back.
        </p>

        {loading ? (
          <div className="empty-state">Loading matches...</div>
        ) : matches.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">♥</div>
            <h2>No matches yet</h2>
            <p>
              When someone you like likes you back,
              they'll appear here.
            </p>
            <Link href="/" className="primary-button">
              Discover people
            </Link>
          </div>
        ) : (
          <div className="matches-grid">
            {matches.map((person) => (
              <div className="match-card" key={person.id}>
                <img src={person.photo} alt={person.name} />
                <div>
                  <h3>{person.name}, {person.age}</h3>
                  <p>{person.city}</p>
                </div>
                <span className="match-heart">♥</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <nav className="bottom-nav">
        <Link href="/home" className="nav-item">
          <span>⌂</span>
          Home
        </Link>

        <Link href="/" className="nav-item">
          <span>♡</span>
          Discover
        </Link>

        <Link href="/matches" className="nav-item active">
          <span>♥</span>
          Matches
        </Link>
      </nav>
    </main>
  );
}
