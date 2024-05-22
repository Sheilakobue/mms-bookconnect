import{ useEffect, useState, Fragment } from 'react';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import searchIcon from './Images/magnifying-glass.png';
import filterIcon from './Images/filter.png';
import Fuse from 'fuse.js';
import axios from 'axios';
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { Box } from '@mui/material';

//Cards function
const Cards = () => {
  // Declared const State variables to manage the component behavior
  const [previewData, setPreviewData] = useState([]);
  const [showData, setShowData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredPreviews, setFilteredPreviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [descriptionVisible, setDescriptionVisible] = useState(false);
  const [showAllPreviews, setShowAllPreviews] = useState(false);
  const previewsToShowInitial = 6;
  const previewsToLoadMore = 6;
  const [numPreviewsShown, setNumPreviewsShown] = useState(
    previewsToShowInitial
  );
  const [savedFavorites, setSavedFavorites] = useState([]);

  // Mapping of genre IDs to their titles
  const genreTitleMapping = {
    1: "Personal Growth",
    2: "True Crime and Investigative Journalism",
    3: "History",
    4: "Comedy",
    5: "Entertainment",
    6: "Business",
    7: "Fiction",
    8: "News",
    9: "Kids and Family",
  };

  /**Fetch Data */

  // This fetches data of podcast show previews from the URL
  useEffect(() => {
    setLoading(true);
    fetch("https://podcast-api.netlify.app/shows")
      .then((response) => response.json())
      .then((data) => {
        setPreviewData(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching previews:", error));
  }, []);

  // Fetch show details based on the provided show ID
  const fetchShowDetails = async (showId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://podcast-api.netlify.app/id/${showId}`
      );
      const data = response.data;
      setShowData(data);
      setSelectedSeason(null);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching show details:", error);
    }
  };

  /**Functions */

  // This Function toggle for the favorite status of a show
  const toggleFavorite = (showId) => {
    const isFavorite = savedFavorites.includes(showId);

    if (isFavorite) {
      setSavedFavorites((prevFavorites) =>
        prevFavorites.filter((id) => id !== showId)
      );
    } else {
      setSavedFavorites((prevFavorites) => [...prevFavorites, showId]);
    }
  };

  // Function to toggle between showing all previews and limited previews
  const toggleShowAllPreviews = () => {
    setShowAllPreviews((prevValue) => !prevValue);
  };

  // Function to format a date string
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to check if a show is already saved as a favorite
  const isFavoriteShow = (showId) => {
    return savedFavorites.includes(showId);
  };

  /**Event Handlers: that are triggered when certain actions occur: */

  // Called when the user clicks on a show preview: to view its details
  const handleShowClick = (showId) => {
    fetchShowDetails(showId);
  };

  // For clicking on a genre filter button:to filter the previews by genre
  const handleGenreClick = (genreId) => {
    setSelectedGenre((prevSelectedGenre) =>
      prevSelectedGenre === genreId ? null : genreId
    );
  };

  // For clicking on a season filter button: to filter previews by season number
  const handleSeasonClick = (seasonNumber) => {
    setSelectedSeason(seasonNumber);
  };

  // For search input change:to update the search query state
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // For when a "Show More" button click: to load more cards
  const handleShowMoreClick = () => {
    setNumPreviewsShown((prevValue) => prevValue + previewsToLoadMore);
  };

  // For sorting :when the user selects different sorting option to update the sorting state
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Get the list of previews to display based on showAllPreviews state
  const previewsToDisplay = showAllPreviews
    ? filteredPreviews
    : filteredPreviews.slice(0, numPreviewsShown);

  /**Filter */

  // Filtering and sorting previews based on searchQuery, selectedGenre, and sortBy
  useEffect(() => {
    filterPreviews();
  }, [searchQuery, sortBy, previewData, selectedGenre]);

  // Filter and sort the previews data based on current filter criteria
  const filterPreviews = () => {
    let filteredPreviews = [...previewData];
    // Filter by title using Fuse.js
    if (searchQuery) {
      const fuse = new Fuse(filteredPreviews, { keys: ["title"] });
      filteredPreviews = fuse.search(searchQuery).map((result) => result.item);
    }

    // Filter by genre (assuming you have selectedGenre as a state variable)
    if (selectedGenre) {
      filteredPreviews = filteredPreviews.filter((preview) =>
        preview.genres.includes(parseInt(selectedGenre))
      );
    }
    // Apply sorting based on the current sortBy option
    switch (sortBy) {
      case "title":
        filteredPreviews.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-az":
        filteredPreviews.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "dateUpdatedAscending":
        filteredPreviews.sort(
          (a, b) => new Date(a.updated) - new Date(b.updated)
        );
        break;
      case "dateUpdatedDescending":
        filteredPreviews.sort(
          (a, b) => new Date(b.updated) - new Date(a.updated)
        );
        break;
      default:
        //  if no option is selected or an invalid option is provided
        filteredPreviews.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    setFilteredPreviews(filteredPreviews); 
  };

  // Render loading state when data is being fetched
  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress size={60} />
        <h2>Loading...</h2>
      </div>
    );
  }

  // Render the main component when showData is null (i.e., show list view)
  if (!showData) {
    return (
      <Box className="Box-container">
        <img src={searchIcon} alt="Search Icons" className="Icons" />

        {/* Search input */}
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by title..."
        />

        {/* Sort select */}
        <select id="sortDropdown" onChange={handleSortChange}>
          <option value="" disabled selected>
            Select an option
          </option>
          <option value="choose">Choose</option>
          <option value="title">Sort by Title (A-Z)</option>
          <option value="title-az">Sort by Title (Z-A)</option>
          <option value="dateUpdatedAscending">Date Updated (Ascending)</option>
          <option value="dateUpdatedDescending">
            Date Updated (Descending)
          </option>
        </select>

        <div className="Card-Box">
          <img src={filterIcon} alt="Search Icons" className="Icons" />
          <h3>Filter by Genre:</h3>

          {/* Map through genreTitleMapping and render filter buttons */}
          {Object.entries(genreTitleMapping).map(([genreId, genreTitle]) => (
            <button
              key={genreId}
              onClick={() => handleGenreClick(parseInt(genreId))}
              style={{
                backgroundColor:
                  selectedGenre === parseInt(genreId) ? "blue" : "lightblue",
                color: selectedGenre === parseInt(genreId) ? "white" : "black",
                border: "1px solid blue",
                padding: "5px",
                margin: "2px",
                cursor: "pointer",
              }}
            >
              {genreTitle}
            </button>
          ))}

          {/* Genre button*/}
          <button
            className="Genre-Buttons"
            onClick={() => setSelectedGenre(null)}
            style={{
              backgroundColor: selectedGenre === null ? "blue" : "lightblue",
              color: selectedGenre === null ? "white" : "black",
              border: "1px solid black",
              padding: "5px",
              margin: "2px",
              cursor: "pointer",
            }}
          >
            All Genres
          </button>
        </div>

        {/*Card description */}
        <div className="card-box">
          <Grid container spacing={3}>
            {previewsToDisplay.map((show) => (
              <Grid item xs={12} sm={6} md={4} key={show.id}>
                <div className="preview-item">
                  <div className="card-image">
                    <img
                      src={show.image}
                      alt={show.title}
                      className="preview-image"
                    />
                  </div>
                  <div className="info">
                    <h3>Title: {show.title}</h3>
                    <p>
                      Genre:{" "}
                      {show.genres
                        .map((genreId) => genreTitleMapping[genreId])
                        .join(",")}
                    </p>
                    <p>Seasons: {show.seasons}</p>

                    {/* Toggle description visibility */}
                    {descriptionVisible && (
                      <p>Description: {show.description}</p>
                    )}
                    <p>Last Updated: {formatDate(show.updated)} </p>
                  </div>
                  <div className="buttons">
                    <button
                      style={{
                        backgroundColor: "lightblue",
                        color: "darkblue",
                        border: "1px solid blue",
                        padding: "5px",
                        margin: "2px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleShowClick(show.id)}
                    >
                      Seasons
                    </button>

                    {/* Toggle description visibility on button click */}
                    <button
                      style={{
                        backgroundColor: "lightblue",
                        color: "darkblue",
                        border: "1px solid blue",
                        padding: "5px",
                        margin: "2px",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        setDescriptionVisible((prevValue) => !prevValue)
                      }
                    >
                      {descriptionVisible
                        ? "Hide Description"
                        : "Show Description"}
                    </button>

                    {/* Favorite button */}
                    <IconButton
                      style={{
                        backgroundColor: isFavoriteShow(show.id)
                          ? "red"
                          : "gray",
                        color: "darkblue",
                        border: "1px solid blue",
                        padding: "5px",
                        margin: "2px",
                        cursor: "pointer",
                      }}
                      onClick={() => toggleFavorite(show.id)}
                    >
                      {isFavoriteShow(show.id) ? (
                        <Favorite />
                      ) : (
                        <FavoriteBorder />
                      )}
                    </IconButton>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        </div>

        {/* Show More and Show Less buttons */}
        {filteredPreviews.length > numPreviewsShown && (
          <div className="showMoreLess-buttons">
            <button onClick={handleShowMoreClick}>Show More</button>
          </div>
        )}

        {/* Show Less button */}
        {showAllPreviews && (
          <div className="show-more-less-buttons">
            <button onClick={toggleShowAllPreviews}>Show Less</button>
          </div>
        )}
      </Box>
    );
  }

  // Render the show details when showData is available (i.e., season view)
  return (
    <div className="season-container">
      <IconButton
        variant="outlined"
        style={{ backgroundColor: "lightblue", color: "darkblue" }}
        size="small"
        onClick={() => setShowData(null)}
      >
        <ArrowBackIcon />
      </IconButton>

      <h2>{showData.title}</h2>
      {showData.seasons.map((season) => (
        <div key={season.number}>
          <h3>Season {season.number}</h3>
          {selectedSeason === season.number ? (
            <ul>
              {season.episodes.map((episode) => (
                <Fragment key={episode.id}>
                  <h4>{episode.name}</h4>
                  <li>{episode.title}</li>
                  <p>{episode.description}</p>
                  <audio controls>
                    <source src={episode.file} />
                  </audio>
                </Fragment>
              ))}
            </ul>
          ) : (
            <div>
              <img
                className="seasons"
                src={season.image}
                alt={`Season ${season.number}`}
              />
              <button onClick={() => handleSeasonClick(season.number)}>
                View Episodes
              </button>
              {season.episodes.length} Episodes
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Cards;