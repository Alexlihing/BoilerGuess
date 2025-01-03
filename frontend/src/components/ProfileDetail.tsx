import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Trophy, Star, Target, Flame, MapPin } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import AccuracyGauge from "./AccuracyGauge";
import SearchBar from "./SeachBar";
import authHook from "../hooks/authHook";
import defaultPFP from "../assets/default-pfp.jpg";
const ProfileDetail = () => {
  const [player, setPlayer] = useState();
  const { username } = useParams();
  const navigate = useNavigate();
  const { loggedIn, user, logout } = authHook();

  if (!loggedIn) {
    navigate("/login");
  }

  useEffect(() => {
    async function fetchPlayerDetails() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/playerDetails`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ token, username }),
          }
        );
        const data = await response.json();
        setPlayer(data);
      } catch (error) {
        console.error("Error fetching player details:", error);
      }
    }

    fetchPlayerDetails();
  }, [username]);

  if (!player) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Header */}
      <header className="bg-black text-white py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <MapPin className="h-8 w-8 text-yellow-500" />
            <div>
              <h1 className="text-3xl font-bold">BoilerGuessr</h1>
              <p className="text-yellow-500 text-sm">Boiler Up! Hammer Down!</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <SearchBar />
            <Button
              className="bg-yellow-500 text-black px-4 py-2 rounded-md hover:bg-yellow-600 transition"
              onClick={() => navigate("/leaderboard")}
            >
              Return to Leaderboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Profile Overview */}
          <section className="lg:col-span-1 bg-white shadow-md rounded-lg p-6">
            <div className="text-center">
              <img
                src={
                  player.ProfilePicture !=
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    ? `${import.meta.env.VITE_BACKEND_URL}${
                        player.ProfilePicture
                      }`
                    : defaultPFP
                }
                alt="Profile Picture"
                className="w-32 h-32 mx-auto rounded-full object-cover"
              />
              <h2 className="text-2xl font-bold">{player.username}</h2>
            </div>
            <div className="space-y-4 mt-6">
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <Star className="mr-2 text-yellow-500" /> Lifetime Points
                </span>
                <span className="font-semibold text-blue-800">
                  {player.points}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <Flame className="mr-2 text-red-500" /> Current Streak
                </span>
                <span className="font-semibold text-blue-800">
                  {player.streak}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <Target className="mr-2 text-green-500" /> Longest Streak
                </span>
                <span className="font-semibold text-blue-800">
                  {player.lifeTimeStreak}
                </span>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              {player.gamesPlayed > 0 && (
                <AccuracyGauge accuracy={player.Accuracy} />
              )}
            </div>
          </section>

          {/* Achievements */}
          <section className="lg:col-span-3">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-blue-800">Achievements</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {player.achievements
                  .sort((a, b) => (a.progress === "Completed!" ? -1 : 1))
                  .map((achievement, index) => (
                    <Card
                      key={index}
                      className={`p-4 border-2 rounded-lg ${
                        achievement.progress === "Completed!"
                          ? "bg-green-50 border-green-500"
                          : "bg-white border-gray-200 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <Trophy
                          className={`h-8 w-8 ${
                            achievement.progress === "Completed!"
                              ? "text-green-500"
                              : "text-yellow-500"
                          }`}
                        />
                        <div>
                          <h3 className="font-bold text-blue-800">
                            {achievement.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {achievement.description}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              achievement.progress === "Completed!"
                                ? "text-green-500 font-medium"
                                : "text-gray-500"
                            }`}
                          >
                            {achievement.progress}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ProfileDetail;
