import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import "./AnimeDetails.css";

const API = "https://api.jikan.moe/v4";

// smooth horizontal scroll tuning
const WHEEL_SPEED = 1.25; // increase to go faster
const MAX_VELOCITY = 90;

const AnimeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // If you navigate to details from your genre page, pass state like:
  // navigate(`/anime/${anime.mal_id}`, { state: { fromGenre: "/genre/1", genreName: "Action" } })
  const fromGenre = location.state?.fromGenre || null;
  const genreName = location.state?.genreName || null;

  const [anime, setAnime] = useState(null);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recsLoading, setRecsLoading] = useState(true);
  const [error, setError] = useState("");

  const recRowRef = useRef(null);

  // wheel smoothing state
  const rafRef = useRef(null);
  const velRef = useRef(0);
  const hoverRef = useRef(false);

  const primaryGenre = useMemo(() => {
    if (!anime?.genres?.length) return null;
    return anime.genres[0]; // { mal_id, name }
  }, [anime]);

  useEffect(() => {
    let mounted = true;

    const fetchAll = async () => {
      setLoading(true);
      setError("");
      setAnime(null);
      setRecs([]);
      setRecsLoading(true);

      try {
        const detailRes = await axios.get(`${API}/anime/${id}/full`);
        if (!mounted) return;

        const detail = detailRes.data?.data;
        setAnime(detail);
        setLoading(false);

        // fetch recs from same genre (simple + consistent)
        const g = detail?.genres?.[0];
        if (!g?.mal_id) {
          setRecs([]);
          setRecsLoading(false);
          return;
        }

        const recRes = await axios.get(
          `${API}/anime?genres=${g.mal_id}&order_by=score&sort=desc&limit=18`
        );
        if (!mounted) return;

        const list = (recRes.data?.data || [])
          .filter((a) => String(a.mal_id) !== String(id))
          .slice(0, 14);

        setRecs(list);
        setRecsLoading(false);
      } catch (e) {
        if (!mounted) return;
        setError("Couldn’t load anime details. Try again.");
        setLoading(false);
        setRecsLoading(false);
      }
    };

    fetchAll();
    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      velRef.current = 0;
    };
  }, [id]);

  // Smooth wheel -> horizontal scroll (only while hovering the rec row)
  useEffect(() => {
    const el = recRowRef.current;
    if (!el) return;

    const tick = () => {
      const node = recRowRef.current;
      if (!node) return;

      // apply velocity
      if (Math.abs(velRef.current) > 0.2) {
        node.scrollLeft += velRef.current;
        velRef.current *= 0.86; // friction
        rafRef.current = requestAnimationFrame(tick);
      } else {
        velRef.current = 0;
        rafRef.current = null;
      }
    };

    const onWheel = (e) => {
      if (!hoverRef.current) return; // only when hovering the row
      // stop page scroll while on the row
      e.preventDefault();

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const next = velRef.current + delta * WHEEL_SPEED;

      // clamp
      velRef.current = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, next));

      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    };

    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheel);
    };
  }, [recsLoading]);

  const goBack = () => navigate(-1);

  const goBackToGenre = () => {
    if (fromGenre) navigate(fromGenre);
    else navigate("/genres"); // fallback (change if your route differs)
  };

  const openAnime = (malId) => {
    navigate(`/anime/${malId}`, {
      state: {
        fromGenre,
        genreName: genreName || primaryGenre?.name || null,
      },
    });
  };

  return (
    <div className="anime-details-page">
      <div className="anime-details__content">
        <div className="anime-details__topbar">
          <button className="ad-btn" onClick={goBack}>
            ← Back
          </button>

          <button className="ad-btn ad-btn--ghost" onClick={goBackToGenre}>
            ↩ Back to Genre
          </button>
        </div>

        {error && <div className="ad-error">{error}</div>}

        {/* DETAILS CARD */}
        {loading ? (
          <div className="ad-card ad-card--skeleton">
            <div className="ad-skel__poster shimmer" />
            <div className="ad-skel__info">
              <div className="ad-skel__title shimmer" />
              <div className="ad-skel__meta shimmer" />
              <div className="ad-skel__meta shimmer" />
              <div className="ad-skel__desc shimmer" />
              <div className="ad-skel__desc shimmer" />
              <div className="ad-skel__desc shimmer" />
              <div className="ad-skel__chips">
                <span className="ad-skel__chip shimmer" />
                <span className="ad-skel__chip shimmer" />
                <span className="ad-skel__chip shimmer" />
              </div>
            </div>
          </div>
        ) : anime ? (
          <div className="ad-card">
            <div className="ad-posterWrap">
              <img
                className="ad-poster"
                src={
                  anime.images?.jpg?.large_image_url ||
                  anime.images?.jpg?.image_url
                }
                alt={anime.title}
                loading="lazy"
              />
            </div>

            <div className="ad-info">
              <h1 className="ad-title">{anime.title}</h1>

              <div className="ad-meta">
                <span>{anime.type || "TV"}</span>
                <span className="dot" />
                <span>{anime.episodes ? `${anime.episodes} eps` : "— eps"}</span>
                <span className="dot" />
                <span>{anime.status || "—"}</span>
                <span className="dot" />
                <span>
                  {anime.score ? `⭐ ${anime.score}` : "⭐ —"}
                </span>
              </div>

              <p className="ad-desc">{anime.synopsis || "No synopsis available."}</p>

              <div className="ad-chips">
                {(anime.genres || []).slice(0, 8).map((g) => (
                  <span key={g.mal_id} className="ad-chip">
                    {g.name}
                  </span>
                ))}
              </div>

              {anime.trailer?.url && (
                <a
                  className="ad-trailer"
                  href={anime.trailer.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Watch Trailer →
                </a>
              )}
            </div>
          </div>
        ) : null}

        {/* RECOMMENDED ROW */}
        <div className="ad-recs">
          <div className="ad-recs__header">
            <h2 className="ad-recs__title">
              Recommended from{" "}
              <span className="ad-recs__genre">
                {genreName || primaryGenre?.name || "this genre"}
              </span>
            </h2>
          </div>

          <div
            className="ad-recs__row"
            ref={recRowRef}
            onMouseEnter={() => (hoverRef.current = true)}
            onMouseLeave={() => (hoverRef.current = false)}
          >
            {recsLoading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="ad-miniCard ad-miniCard--skeleton">
                    <div className="ad-miniCard__img shimmer" />
                    <div className="ad-miniCard__title shimmer" />
                  </div>
                ))
              : recs.map((a) => (
                  <button
                    key={a.mal_id}
                    className="ad-miniCard"
                    onClick={() => openAnime(a.mal_id)}
                    title={a.title}
                  >
                    <div className="ad-miniCard__imgWrap">
                      <img
                        className="ad-miniCard__imgReal"
                        src={
                          a.images?.jpg?.large_image_url ||
                          a.images?.jpg?.image_url
                        }
                        alt={a.title}
                        loading="lazy"
                      />
                    </div>
                    <div className="ad-miniCard__name">{a.title}</div>
                  </button>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetails;
