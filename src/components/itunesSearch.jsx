import { useState, useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


// iTunes Search API
// https://itunes.apple.com/search?term=SEARCH_TERM&media=music&limit=10
//
// Each track in response.results has:
//   trackName        — song title
//   artistName       — artist name
//   collectionName   — album name
//   artworkUrl100    — album art image (100x100)
//   primaryGenreName — genre
//   previewUrl       — 30 second audio preview URL

// ─── TrackCard component ──────────────────────────────────────────────────────
function TrackCard({ title, artist, album, image, genre, previewUrl }) {
  return (
    <div style={{
      width: "180px",
      border: "1px solid #eee",
      borderRadius: "10px",
      overflow: "hidden",
      background: "#fff",
    }}>
      <img
        src={image}
        alt={title}
        style={{ width: "100%", height: "180px", objectFit: "cover" }}
      />
      <div style={{ padding: "10px" }}>
        <p style={{ fontWeight: "500", fontSize: "14px", margin: "0 0 4px" }}>{title}</p>
        <p style={{ fontSize: "12px", color: "#888", margin: "0 0 2px" }}>{artist}</p>
        <p style={{ fontSize: "11px", color: "#aaa", margin: 0 }}>{genre}</p>
        <p style={{ fontSize: "11px", color: "#aaa", margin: "4px 0 0", width: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{album}</p>
        {previewUrl && (
          <audio controls src={previewUrl} />
        )}
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function ItunesSearch() {
  const [searchTerm, setSearchTerm] = useState("");

  // TODO 1: Declare state variables for tracks, loading, and error

  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = `https://itunes.apple.com/search?term=${searchTerm}&media=music&limit=10`;

  // TODO 2: Write a useEffect that fetches when the component mounts
  //         OR write a handleSearch function that fetches on form submit
  //         - Build the URL using searchTerm
  //         - Use async / await with try / catch / finally
  //         - Check response.ok before parsing JSON
  //         - The tracks live in response.results
  useEffect(() => {
    if (!searchTerm) return; // Don't fetch if searchTerm is empty
    async function fetchTrack() {
      setLoading(true);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("There was some problem fetching Tracks, Please try again");
        }
        const data = await response.json();
        setTracks(data.results);
      }
      catch (err) {
        setError(err.message);
      }
      finally {
        setLoading(false);
      }
    };
    fetchTrack();
  }, [searchTerm]);

  // TODO 3: Handle loading state — render a loading indicator
  if (loading)
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );
  // TODO 4: Handle error state — render an error message
  if (error) return <p>{error}</p>;

  // function handleSearch(e) {
  //   e.preventDefault();
  //   // TODO: trigger your fetch here
  //   setLoading(true);
  // }

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "780px", margin: "0 auto", padding: "24px" }}>
      <h1 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "4px" }}>iTunes Search</h1>
      <p style={{ fontSize: "13px", color: "#888", marginBottom: "20px" }}>Search for an artist or song</p>

      {/* Search form */}
      <form
        // onSubmit={handleSearch}
        style={{ display: "flex", gap: "8px", marginBottom: "24px" }}
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="e.g. Taylor Swift, Coldplay..."
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "14px",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            background: "#111",
            color: "#fff",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </form>

      {searchTerm && !loading && !error && (
  <p>
    {tracks.length} results for "{searchTerm}"
  </p>
)}

      {/* TODO 5: Render TrackCards here once you have data
                 Use a .map() over your tracks state
                 Pass title, artist, album, image, genre as props to each TrackCard */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {tracks.map((track) => (
          <TrackCard
            key={track.trackId}
            title={track.trackName}
            artist={track.artistName}
            album={track.collectionName}
            image={track.artworkUrl100}
            genre={track.primaryGenreName}
            previewUrl={track.previewUrl}
          />
        ))}

      </div>

    </div>
  );
}