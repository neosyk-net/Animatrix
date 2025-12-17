import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SearchPage.css";

const API = "https://api.jikan.moe/v4";

const MIN_LOADING_TIME = 700;
const DEBOUNCE_MS = 450;

const SORTS = {
  DEFAULT: "default", 
  AZ: "az",
  TOP: "top",
  RECENT: "recent",
};


const getSafeTitle = (a) =>
  (a?.title || a?.title_english || a?.title_japanese || "").trim();

const getRecentTimestamp = (a) => {
  const from = a?.aired?.prop?.from;
  if (from?.year) {
    const y = from.year ?? 0;
    const m = (from.month ?? 1) - 1;
    const d = from.day ?? 1;
    return new Date(y, m, d).getTime();
  }
  if (a?.year) return new Date(a.year, 0, 1).getTime();
  return 0;
};

const SearchPage = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sort, setSort] = useState(SORTS.DEFAULT);

  // ✅ debounce typing
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

  // ✅ fetch: default list when empty, search list when typing
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError("");

      const start = Date.now();

      try {
        const url = debounced ? `${API}/anime` : `${API}/top/anime`;

        const { data } = await axios.get(url, {
          params: debounced
            ? {
                q: debounced,
                order_by: "score",
                sort: "desc",
                sfw: true,
                limit: 24,
              }
            : {
                filter: "bypopularity",
                limit: 24,
              },
        });

        const elapsed = Date.now() - start;
        const wait = Math.max(0, MIN_LOADING_TIME - elapsed);
        if (wait) await new Promise((r) => setTimeout(r, wait));

        if (!cancelled) setAnime(data?.data || []);
      } catch (e) {
        if (!cancelled) {
          setError("Couldn’t load anime right now. Try again in a moment.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [debounced]);

const sortedAnime = useMemo(() => {
  const arr = [...anime];

  switch (sort) {
    case SORTS.AZ:
      arr.sort((a, b) => getSafeTitle(a).localeCompare(getSafeTitle(b)));
      break;

    case SORTS.RECENT:
      arr.sort((a, b) => getRecentTimestamp(b) - getRecentTimestamp(a));
      break;

    case SORTS.TOP:
      arr.sort((a, b) => (b?.score ?? -1) - (a?.score ?? -1));
      break;

    case SORTS.DEFAULT:
    default:
      // ✅ no sorting — keep API order
      break;
  }

  return arr;
}, [anime, sort]);


  const onCardClick = (malId) => {
    navigate(`/anime/${malId}`);
  };

  const clear = () => {
    setQuery("");
    setDebounced("");
    setAnime([]);
    setError("");
    setLoading(false);
  };

  return (
    <div className="search-page">
      <div className="search-page__content">
        {/* ===== SEARCH HERO BANNER ===== */}
        <div className="search-banner">
          <div className="search-banner__overlay" />

          <div className="search-banner__content">
            <h1 className="search-banner__title">Enter the Animatrix</h1>
          </div>
        </div>

        <div className="search-top">
          <h1 className="search-title">
            {debounced ? `Results for “${debounced}”` : "Browse Anime"}
          </h1>

          {/* ✅ Search + Sort row */}
          <div className="search-controls">
            <div className="search-row">
              <div className="search-bar">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="search-input"
                  placeholder="Search anime… (Naruto, Bleach, JJK)"
                  aria-label="Search anime"
                />

                {query ? (
                  <button
                    type="button"
                    className="search-clear"
                    onClick={clear}
                  >
                    Clear
                  </button>
                ) : null}
              </div>

              <div className="sort-wrap">
                <label className="sort-label" htmlFor="sortSelect">
                  Sort
                </label>

                <select
                  id="sortSelect"
                  className="sort-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value={SORTS.DEFAULT}>Default</option>
                  <option value={SORTS.TOP}>Top Rated</option>
                  <option value={SORTS.RECENT}>Most Recent</option>
                  <option value={SORTS.AZ}>A to Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {error ? <div className="search-error">{error}</div> : null}

        {/* ✅ Loading state */}
        {loading ? (
          <div className="feed">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="feed-card-btn skeleton-card">
                <div className="feed-card__img-wrap">
                  <div className="skeleton-img" />
                </div>
                <div className="skeleton-title" />
                <div className="skeleton-meta" />
              </div>
            ))}
          </div>
        ) : sortedAnime.length === 0 ? (
          <div className="feed-no-results">
            {debounced ? "No results found." : "Nothing to show right now."}
          </div>
        ) : (
          <div className="feed">
            {sortedAnime.map((a) => {
              const img =
                a?.images?.jpg?.large_image_url ||
                a?.images?.jpg?.image_url ||
                "";
              const title = a?.title || "Untitled";
              const year = a?.year || a?.aired?.prop?.from?.year || "";
              const score = a?.score ?? null;

              return (
                <button
                  key={a.mal_id}
                  className="feed-card-btn"
                  onClick={() => onCardClick(a.mal_id)}
                  type="button"
                >
                  <div className="feed-card__img-wrap">
                    <img className="feed-card__img" src={img} alt={title} />
                  </div>

                  <div className="feed-card__title">{title}</div>

                  <div className="feed-card__meta">
                    <span>{year || "—"}</span>
                    <span className="dot">•</span>
                    <span>{score ? `⭐ ${score}` : "No score"}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
