
"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [match, setMatch] = useState(null);
  const [matchesCount, setMatchesCount] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState("");

  const startX = useRef(0);
  const currentX = useRef(0);

  async function loadFeed() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/feed");

      if (!response.ok) throw new Error("Unable to load profiles");

      const data = await response.json();
      setProfiles(data.profiles || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadMatches() {
    try {
      const response = await fetch("/api/matches");
      const data = await response.json();
      setMatchesCount(data.matches?.length || 0);
    } catch {
      console.error("Could not load matches");
    }
  }

  useEffect(() => {
    loadFeed();
    loadMatches();
  }, []);

  
async function handleSwipe(action) {
  const profile = profiles[0];

  if (!profile || swiping) return;

  setSwiping(true);
  setSwipeDirection(action);
  setError("");

  try {
    // Allow the exit animation to finish
    await new Promise((resolve) => setTimeout(resolve, 350));

    const response = await fetch("/api/swipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        profileId: profile.id,
        action
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Swipe failed");
    }

    setProfiles((previous) =>
      previous.filter((item) => item.id !== profile.id)
    );

    if (data.isMatch) {
      setMatch(data.match);
      setMatchesCount((count) => count + 1);
    }
  } catch (err) {
    setError(err.message);
  } finally {
    setSwipeDirection("");
    setDragX(0);
    setSwiping(false);
  }
}

  function handlePointerDown(event) {
    if (swiping) return;

    startX.current = event.clientX;
    currentX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;

    currentX.current = event.clientX;
    setDragX(currentX.current - startX.current);
  }

  function handlePointerUp(event) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;

    const distance = currentX.current - startX.current;

    if (distance > 100) {
      handleSwipe("like");
    } else if (distance < -100) {
      handleSwipe("pass");
    } else {
      setDragX(0);
    }
  }

  const profile = profiles[0];

  return (
    <main className="app-shell">
      <header className="topbar">
        <Link href="/" className="logo">
          coy<span>.</span>
        </Link>

        <button className="settings-button" aria-label="Settings">
          ⚙
        </button>
      </header>

      <section className="discover-content">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR NEXT CONNECTION</p>
            <h1>Discover</h1>
            <p className="subtitle">
              A little curiosity can go a long way.
            </p>
          </div>

          <span className="profile-count">
            {profiles.length} left
          </span>
        </div>

        {error && <p className="error-message">{error}</p>}

        {loading ? (
          <div className="empty-state">
            <div className="loader"></div>
            <p>Finding people for you...</p>
          </div>
        ) : profile ? (
          <>
            <div className="swipe-card-wrapper">
              <div
                className={`profile-card ${
                  swipeDirection ? `swipe-${swipeDirection}` : ""
                }`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={() => setDragX(0)}
                style={
                  swipeDirection
                    ? {}
                    : {
                        transform: `translateX(${dragX}px) rotate(${dragX * 0.04}deg)`,
                        transition: dragX === 0 ? "transform 0.3s ease" : "none"
                      }
                }
              >
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="profile-photo"
                  draggable="false"
                />

                <div className="photo-gradient"></div>

                {(dragX > 30 || swipeDirection === "like") && (
                  <span className="swipe-label like-label">
                    LIKE ♥
                  </span>
                )}

                {(dragX < -30 || swipeDirection === "pass") && (
                  <span className="swipe-label pass-label">
                    PASS ✕
                  </span>
                )}

                <div className="profile-info">
                  <div className="profile-name">
                    <h2>{profile.name}, {profile.age}</h2>
                    <span className="verified">✓</span>
                  </div>

                  <p className="profile-location">
                    ♧ {profile.city}
                  </p>

                  {profile.college && (
                    <p className="profile-college">
                      {profile.college}
                    </p>
                  )}

                  <p className="profile-bio">{profile.bio}</p>

                  <div className="interest-list">
                    {profile.interests?.map((interest) => (
                      <span key={interest}>{interest}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <p className="swipe-hint">
              ← Pass <span>•</span> Like →
            </p>

            <div className="swipe-actions">
              <button
                className="action-button pass-button"
                onClick={() => handleSwipe("pass")}
                disabled={swiping}
                aria-label="Pass"
              >
                ×
              </button>

              <button
                className="action-button like-button"
                onClick={() => handleSwipe("like")}
                disabled={swiping}
                aria-label="Like"
              >
                ♥
              </button>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">♥</div>
            <h2>You're all caught up!</h2>
            <p>You've seen everyone for now. Check back later.</p>
            <button className="primary-button" onClick={loadFeed}>
              Refresh Discover
            </button>
          </div>
        )}
      </section>

      <nav className="bottom-nav">
        <Link href="/home" className="nav-item">
          <span>⌂</span>
          Home
        </Link>

        <Link href="/" className="nav-item active">
          <span>♡</span>
          Discover
        </Link>

        <Link href="/matches" className="nav-item">
          <span>♥</span>
          Matches
          {matchesCount > 0 && (
            <span className="nav-count">{matchesCount}</span>
          )}
        </Link>
      </nav>

      {match && (
        <div className="modal-overlay">
          <div className="match-modal">
            <button
              className="modal-close"
              onClick={() => setMatch(null)}
              aria-label="Close"
            >
              ×
            </button>

            <div className="match-hearts">♥ ♥</div>
            <p className="eyebrow">SOMETHING SPECIAL</p>
            <h2>It's a match!</h2>
            <p>You and {match.name} like each other.</p>

            <img
              src={match.photo}
              alt={match.name}
              className="match-photo"
            />

            <Link
              href="/matches"
              className="primary-button"
              onClick={() => setMatch(null)}
            >
              See your matches
            </Link>

            <button
              className="secondary-button"
              onClick={() => setMatch(null)}
            >
              Keep discovering
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
