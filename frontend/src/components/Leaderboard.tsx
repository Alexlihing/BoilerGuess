import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Trophy,
  Flame,
  GamepadIcon,
  Search,
  User,
  ArrowLeft,
  MapPin,
} from "lucide-react";
import SearchBar from "./SeachBar";
import { useNavigate } from "react-router-dom";
import authHook from "../hooks/authHook";
import defaultPFP from "../assets/default-pfp.jpg";
const PurdueGeoguesserLeaderboard = () => {
  const navigate = useNavigate();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "points",
    direction: "ascending",
  });
  const [hoveredUser, setHoveredUser] = useState(null);

  useEffect(() => {
    async function getUsers() {
      const token = localStorage.getItem("token");

      try {
        let response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/game/getPlayers`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
            credentials: "include",
          }
        );

        let players = await response.json();

        players = players.map((player) => ({
          ...player,
          completedAchievements: player.achievements
            ? player.achievements.filter((a) => a.progress === "Completed!")
                .length
            : 0,
        }));

        players.sort((a, b) => b.points - a.points);

        setLeaderboardData(players);
      } catch (error) {
        console.error(error);
      }
    }
    getUsers();
  }, []);

  const sortData = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "descending"
        ? "ascending"
        : "descending";

    const sortedData = [...leaderboardData].sort((a, b) => {
      if (direction === "descending") {
        return b[key] - a[key];
      }
      return a[key] - b[key];
    });

    setLeaderboardData(sortedData);
    setSortConfig({ key, direction });
  };

  return (
    <div
      style={{
        backgroundColor: "lightblue",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          backgroundColor: "black",
          color: "white",
          padding: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <a
            href="/profile"
            style={{
              color: "white",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <ArrowLeft />
            <span>Back</span>
          </a>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MapPin className="h-8 w-8 text-yellow-500" />
            <span
              style={{ fontSize: "1.25rem", fontWeight: "bold", color: "gold" }}
            >
              BoilerGuesser
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <SearchBar />
          <a
            href="/profile"
            style={{
              backgroundColor: "gold",
              color: "black",
              padding: "0.5rem",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <User />
          </a>
        </div>
      </nav>

      {/* Leaderboard Container */}
      <div
        style={{
          maxWidth: "800px",
          margin: "2rem auto",
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            backgroundColor: "black",
            color: "white",
            padding: "1.5rem",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Leaderboard</h1>
        </div>

        <div
          style={{
            padding: "1rem",
            backgroundColor: "#f7f7f7",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {["points", "gamesPlayed", "completedAchievements", "streak"].map(
            (key) => (
              <button
                key={key}
                onClick={() => sortData(key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "white",
                  border: "1px solid gold",
                  borderRadius: "5px",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                  gap: "0.5rem",
                }}
              >
                {key === "points" && <Trophy />}
                {key === "gamesPlayed" && <GamepadIcon />}
                {key === "completedAchievements" && <Trophy />}
                {key === "streak" && <Flame />}
                {key.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
                  return str.toUpperCase();
                })}
                {sortConfig.key === key &&
                  (sortConfig.direction === "descending" ? (
                    <ChevronDown />
                  ) : (
                    <ChevronUp />
                  ))}
              </button>
            )
          )}
        </div>

        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {leaderboardData.map((user, index) => (
            <div
              key={user._id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "1rem",
                borderBottom: "1px solid #eaeaea",
                backgroundColor:
                  // colors for each place
                  index === 0
                    ? "#ffd700"
                    : index === 1
                    ? "#c0c0c0"
                    : index === 2
                    ? "#cd7f32"
                    : hoveredUser === user._id
                    ? "#fdf7e2"
                    : "transparent",
                cursor: "pointer",
                transition: "background-color 0.3s ease, transform 0.2s ease",
              }}
              onMouseEnter={() => setHoveredUser(user._id)}
              onMouseLeave={() => setHoveredUser(null)}
              onClick={() => navigate(`/player/${user.username}`)}
            >
              <div style={{ marginRight: "1rem", fontWeight: "bold" }}>
                {index + 1}
              </div>
              <img
                src={
                  user.ProfilePicture !=
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    ? `${import.meta.env.VITE_BACKEND_URL}${
                        user.ProfilePicture
                      }`
                    : defaultPFP
                }
                alt="Profile"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  marginRight: "1rem",
                  border: "2px solid black",
                }}
              />

              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                  {user.username}
                </h3>
              </div>
              <div style={{ display: "flex", gap: "1rem", color: "#555" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Trophy />
                  {user.points} pts
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <GamepadIcon />
                  {user.gamesPlayed}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Trophy />
                  {user.completedAchievements}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Flame />
                  {user.lifeTimeStreak}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PurdueGeoguesserLeaderboard;