import { CountryRoadmap } from "../types";

export const kazakhstanRoadmapMock: CountryRoadmap = {
  countryCode: "KZ",
  mapImage: "/assets/maps/kazakhstan.png",
  nodes: [
    {
      id: "kz-level-1",
      title: "Welcome to Kazakhstan",
      gameType: "scenario",
      position: { x: 24, y: 64 }, // Aktau / Caspian Sea Coast
      isLocked: false,
      isCompleted: true,
      routePath: "/app/countries/kz/learn",
    },
    {
      id: "kz-level-2",
      title: "Culture Match Rush",
      gameType: "flashcards",
      position: { x: 42, y: 64 }, // Baikonur area
      isLocked: false,
      isCompleted: false,
      routePath: "/app/countries/kz/game",
    },
    {
      id: "kz-level-3",
      title: "Street Food Sprint",
      gameType: "matching",
      position: { x: 53, y: 77 }, // Shymkent area (Deep South)
      isLocked: false,
      isCompleted: false,
      routePath: "/app/countries/kz/sprint",
    },
    {
      id: "kz-level-4",
      title: "Festival Timeline",
      gameType: "scenario",
      position: { x: 68, y: 72 }, // Tien Shan / Almaty area
      isLocked: false,
      isCompleted: false,
      routePath: "/app/countries/kz/festival",
    },
    {
      id: "kz-level-5",
      title: "Cultural Quiz",
      gameType: "quiz",
      position: { x: 63, y: 45 }, // Karaganda area (Center)
      isLocked: true,
      isCompleted: false,
      routePath: "/games/quiz/kz-culture",
    },
    {
      id: "kz-level-6",
      title: "History & Legends",
      gameType: "quiz",
      position: { x: 55, y: 32 }, // Astana area (North)
      isLocked: true,
      isCompleted: false,
      routePath: "/games/quiz/kz-history",
    },
  ],
};
