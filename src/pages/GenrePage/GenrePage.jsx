import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./GenrePage.css";

import action_banner from "../../assets/GenreBanners/action-banner.jpg";
import adventure_banner from "../../assets/GenreBanners/adventure-banner.png";
import fantasy_banner from "../../assets/GenreBanners/fantasy-banner.jpg";
import horror_banner from "../../assets/GenreBanners/horror-banner.jpg";
import mystery_banner from "../../assets/GenreBanners/mystery-banner.jpg";
import psychological_banner from "../../assets/GenreBanners/psychological-banner.jpg";

const GENRE_META = {
  action: { title: "Action", banner: action_banner, jikanId: 1 },
  adventure: { title: "Adventure", banner: adventure_banner, jikanId: 2 },
  mystery: { title: "Mystery", banner: mystery_banner, jikanId: 7 },
  fantasy: { title: "Fantasy", banner: fantasy_banner, jikanId: 10 },
  horror: { title: "Horror", banner: horror_banner, jikanId: 14 },
  psychological: {
    title: "Psychological",
    banner: psychological_banner,
    jikanId: 40,
  },
};

const PAGE_SIZE = 24;

const GenrePage = () => {
  const navigate = useNavigate();
  const { genreKey } = useParams();

  const meta = useMemo(() => {
    return GENRE_META[genreKey] || GENRE_META.action;
  }, [genreKey]);

  const [anime, setAnime] = useState([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const [hasNextPage, setHasNextPage] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  /* ===== SHOW SCROLL TO TOP BUTTON ===== */
  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ===== RESET ON GENRE CHANGE ===== */
  useEffect(() => {
    setAnime([]);
    setPage(1);
    setError("");
    setLoading(true);
  }, [meta.jikanId]);

  /* ===== FETCH FIRST PAGE ===== */
  useEffect(() => {
    const fetchAnime = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://api.jikan.moe/v4/anime", {
          params: {
            genres: meta.jikanId,
            page: 1,
            limit: PAGE_SIZE,
            order_by: "score",
            sort: "desc",
          },
        });

        setAnime(res.data.data || []);
        setHasNextPage(Boolean(res.data.pagination?.has_next_page));
      } catch (e) {
        console.error(e);
        setError("Failed to load anime for this genre.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [meta.jikanId]);

  /* ===== LOAD MORE ===== */
  const loadMore = async () => {
    if (!hasNextPage || loadingMore) return;

    try {
      setLoadingMore(true);
      const next = page + 1;

      const res = await axios.get("https://api.jikan.moe/v4/anime", {
        params: {
          genres: meta.jikanId,
          page: next,
          limit: PAGE_SIZE,
          order_by: "score",
          sort: "desc",
        },
      });

      setAnime((prev) => [...prev, ...(res.data.data || [])]);
      setHasNextPage(Boolean(res.data.pagination?.has_next_page));
      setPage(next);
    } catch (e) {
      console.error(e);
      setError("Couldn’t load more anime.");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="genre-page">
      {/* ===== BANNER ===== */}
      <section
        className="genre-banner"
        style={{ backgroundImage: `url(${meta.banner})` }}
      >
        <div className="genre-banner__overlay" />

        <div className="genre-banner__text">
          <button
            type="button"
            className="genre-banner__back"
            onClick={() => navigate("/genres")}
          >
            ← Back to Genres
          </button>

          <h1 className="genre-banner__title">{meta.title}</h1>
        </div>
      </section>

      {/* ===== CONTENT ===== */}
      <div className="genre-page__content">
        {error && <div className="genre-error">{error}</div>}

        {loading ? (
          <div className="anime-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="anime-card skeleton" />
            ))}
          </div>
        ) : (
          <>
            <div className="anime-grid">
              {anime.map((a) => (
                <button
                  key={a.mal_id}
                  className="anime-card"
                  onClick={() =>
                    navigate(`/anime/${a.mal_id}`, {
                      state: { genreKey },
                    })
                  }
                >
                  <div className="anime-poster">
                    <img
                      src={a.images?.jpg?.image_url}
                      alt={a.title}
                      loading="lazy"
                    />
                  </div>

                  <div className="anime-meta">
                    <h3 title={a.title}>{a.title}</h3>
                    <p>
                      ⭐ {a.score ?? "—"} <span className="dot">•</span>{" "}
                      {a.year ?? "—"}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {hasNextPage && (
              <div className="load-more-wrap">
                <button
                  className="load-more"
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? "Loading..." : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ===== SCROLL TO TOP BUTTON ===== */}
      {showScrollTop && (
        <button
          className="scroll-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
        >
          ⮝
        </button>
      )}
    </div>
  );
};

export default GenrePage;
