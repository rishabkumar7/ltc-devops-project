import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './App.module.css';

const API_BASE_URL = 'http://localhost:8000/api';

const TvShowList = ({ onSelectShow }) => {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/shows`);
        setShows(response.data);
      } catch (error) {
        console.error('Error fetching TV shows:', error);
      }
    };

    fetchShows();
  }, []);

  return (
    <div className={styles.showList}>
      <h2>TV Shows</h2>
      <ul>
        {shows.map(show => (
          <li key={show.id} onClick={() => onSelectShow(show.id)}>
            {show.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

const SeasonList = ({ showId }) => {
  const [seasons, setSeasons] = useState([]);

  useEffect(() => {
    const fetchSeasons = async () => {
      if (!showId) return;

      try {
        const response = await axios.get(`${API_BASE_URL}/seasons?show_id=${showId}`);
        setSeasons(response.data.seasons || []);
      } catch (error) {
        console.error('Error fetching seasons:', error);
      }
    };

    fetchSeasons();
  }, [showId]);

  if (!showId) return <p>Select a show to see its episodes.</p>;

  const episodesBySeason = seasons.reduce((acc, episode) => {
    if (!acc[episode.season]) {
      acc[episode.season] = [];
    }
    acc[episode.season].push(episode);
    return acc;
  }, {});

  return (
    <div className={styles.seasonList}>
      <h2>Seasons and Episodes</h2>
      {Object.entries(episodesBySeason).length === 0 ? (
        <p>No episodes found for this show.</p>
      ) : (
        Object.entries(episodesBySeason).map(([season, episodes]) => (
          <div key={season} className={styles.season}>
            <h3>Season {season}</h3>
            <ul>
              {episodes.map((episode, index) => (
                <li key={index} className={styles.episode}>
                  <h4>Episode {episode.episode}: {episode.title}</h4>
                  <p>{episode.description}</p>
                  <div className={styles.episodeInfo}>
                    {episode.airDate && <p>Air Date: {episode.airDate}</p>}
                    {episode.imdbRating && <p>IMDB Rating: {episode.imdbRating}</p>}
                    {episode.directedBy && <p>Directed by: {episode.directedBy}</p>}
                    {episode.writtenBy && <p>Written by: {episode.writtenBy}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

const App = () => {
  const [selectedShowId, setSelectedShowId] = useState(null);

  return (
    <div className={styles.app}>
      <h1 className={styles.header}>Rishab's Favorite TV Shows</h1>
      <div className={styles.container}>
        <TvShowList onSelectShow={setSelectedShowId} />
        <SeasonList showId={selectedShowId} />
      </div>
    </div>
  );
};

export default App;