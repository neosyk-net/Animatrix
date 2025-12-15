import React, { useEffect, useState } from 'react'
import './GenreDisplay.css'
import axios from 'axios'

const ALLOWED_GENRES = [
  'Action',
  'Adventure',
  'Mystery',
  'Horror',
  'Fantasy',
  'Psychological',
]

const MIN_LOADING_TIME = 900 // ms – adjust if you want longer/shorter

const GenreDisplay = () => {
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const start = Date.now()

        const res = await axios.get('https://api.jikan.moe/v4/genres/anime')

        const filtered = res.data.data.filter((g) =>
          ALLOWED_GENRES.includes(g.name)
        )

        setGenres(filtered)

        // ensure skeleton shows for at least MIN_LOADING_TIME
        const elapsed = Date.now() - start
        if (elapsed < MIN_LOADING_TIME) {
          await new Promise((resolve) =>
            setTimeout(resolve, MIN_LOADING_TIME - elapsed)
          )
        }
      } catch (err) {
        console.error(err)
        setError('Failed to load genres')
      } finally {
        setLoading(false)
      }
    }

    fetchGenres()
  }, [])

  /* ===== SKELETON LOADING STATE ===== */
  if (loading) {
    return (
      <section className="genres-hero">
        <div className="genres-overlay">
          <div className="genres-content">
            <div className="genres skeleton">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="genre-card skeleton-card" />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  /* ===== ERROR STATE ===== */
  if (error) {
    return (
      <section className="genres-hero">
        <div className="genres-overlay">
          <div className="genres-content">
            <div className="genres-error">{error}</div>
          </div>
        </div>
      </section>
    )
  }

  /* ===== MAIN CONTENT ===== */
  return (
    <section className="genres-hero">
      <div className="genres-overlay">
        <div className="genres-content">
          <div className="genres">
            {genres.map((g) => (
              <button
                key={g.mal_id}
                className="genre-card"
              >
                <h3>{g.name}</h3>
                <p>{g.count?.toLocaleString()} titles</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default GenreDisplay
