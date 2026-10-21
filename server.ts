import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Data Store seeded from MySQL ets_seed.sql
let users = [
  { userId: 1, fullName: "Admin User", username: "admin", email: "admin@ets.com", passwordHash: "e10adc3949ba59abbe56e057f20f883e", phoneNumber: "9876543210", role: "ADMIN", active: true },
  { userId: 2, fullName: "Alex Viper Mercer", username: "viper", email: "alex@ets.com", passwordHash: "e10adc3949ba59abbe56e057f20f883e", phoneNumber: "9876543211", role: "PLAYER", active: true },
  { userId: 3, fullName: "Sarah Nova Jenkins", username: "nova", email: "sarah@ets.com", passwordHash: "e10adc3949ba59abbe56e057f20f883e", phoneNumber: "9876543212", role: "PLAYER", active: true },
  { userId: 4, fullName: "Rahul Phantom Sharma", username: "phantom", email: "rahul@ets.com", passwordHash: "e10adc3949ba59abbe56e057f20f883e", phoneNumber: "9876543213", role: "PLAYER", active: true },
  { userId: 5, fullName: "Marcus Ghost Vance", username: "ghost", email: "marcus@ets.com", passwordHash: "e10adc3949ba59abbe56e057f20f883e", phoneNumber: "9876543214", role: "PLAYER", active: true },
];

let players: any[] = [
  { playerId: 1, userId: 2, gameId: "VIPER_PUBG_99", teamId: 1, avatarUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop" },
  { playerId: 2, userId: 3, gameId: "NOVA_VAL_07", teamId: 2, avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop" },
  { playerId: 3, userId: 4, gameId: "PHANTOM_FF_88", teamId: 3, avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop" },
  { playerId: 4, userId: 5, gameId: "GHOST_COD_101", teamId: 4, avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop" },
];

let teams = [
  {
    teamId: 1,
    teamName: "Soul eSports",
    teamLogoUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&auto=format&fit=crop",
    game: "PUBG",
    description: "Elite PUBG Mobile squad representing college champions.",
    captainPlayerId: 1,
    members: [
      { memberId: 1, playerId: 1, username: "viper", gameId: "VIPER_PUBG_99", role: "CAPTAIN" },
    ]
  },
  {
    teamId: 2,
    teamName: "Sentinel Prime",
    teamLogoUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&auto=format&fit=crop",
    game: "Valorant",
    description: "Tactical Valorant roster with crisp aim and strategy.",
    captainPlayerId: 2,
    members: [
      { memberId: 2, playerId: 2, username: "nova", gameId: "NOVA_VAL_07", role: "CAPTAIN" },
    ]
  },
  {
    teamId: 3,
    teamName: "Total Gaming Squad",
    teamLogoUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=200&auto=format&fit=crop",
    game: "Free Fire",
    description: "Aggressive Free Fire rushers dominating the rank ladder.",
    captainPlayerId: 3,
    members: [
      { memberId: 3, playerId: 3, username: "phantom", gameId: "PHANTOM_FF_88", role: "CAPTAIN" },
    ]
  },
  {
    teamId: 4,
    teamName: "Shadow Ops",
    teamLogoUrl: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=200&auto=format&fit=crop",
    game: "Call of Duty",
    description: "Call of Duty specialists in search & destroy tactical plays.",
    captainPlayerId: 4,
    members: [
      { memberId: 4, playerId: 4, username: "ghost", gameId: "GHOST_COD_101", role: "CAPTAIN" },
    ]
  },
  {
    teamId: 5,
    teamName: "Navi Cadets",
    teamLogoUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&auto=format&fit=crop",
    game: "Counter-Strike",
    description: "CS2 tactical marksmen focused on site utility and clutches.",
    captainPlayerId: 5,
    members: [
      { memberId: 5, playerId: 5, username: "frost", gameId: "FROST_CS_55", role: "CAPTAIN" },
    ]
  }
];

let tournaments = [
  {
    tournamentId: 1,
    name: "PUBG Chicken Dinner Cup",
    game: "PUBG",
    description: "Ultimate 32-squad PUBG Battle Royale tournament across Erangel and Miramar maps.",
    bannerUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop",
    tournamentDate: "2026-10-05",
    startTime: "18:00",
    registrationDeadline: "2026-10-04",
    maxTeams: 32,
    currentTeams: 28,
    entryFee: 500,
    prizePool: 20000,
    status: "LIVE",
    rules: "Standard Erangel/Miramar squad rules. Point matrix based on kills and placement.",
    organizer: "ETS Official"
  },
  {
    tournamentId: 2,
    name: "Call of Duty Frontline Clash",
    game: "Call of Duty",
    description: "Fast-paced 5v5 Call of Duty multiplayer tournament featuring Search & Destroy and Hardpoint.",
    bannerUrl: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=1200&auto=format&fit=crop",
    tournamentDate: "2026-10-10",
    startTime: "19:00",
    registrationDeadline: "2026-10-09",
    maxTeams: 20,
    currentTeams: 16,
    entryFee: 600,
    prizePool: 18000,
    status: "LIVE",
    rules: "Best of 3 maps. Hardpoint, Search & Destroy, Control. Official competitive bans apply.",
    organizer: "ETS Official"
  },
  {
    tournamentId: 3,
    name: "Free Fire Booyah Series",
    game: "Free Fire",
    description: "High-intensity Free Fire squad battle royale with 48 registered squads battling for glory.",
    bannerUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&auto=format&fit=crop",
    tournamentDate: "2026-10-15",
    startTime: "17:00",
    registrationDeadline: "2026-10-14",
    maxTeams: 48,
    currentTeams: 30,
    entryFee: 400,
    prizePool: 15000,
    status: "OPEN",
    rules: "6 rounds across Bermuda, Purgatory and Kalahari. Top 12 squads advance to finals.",
    organizer: "ETS Official"
  },
  {
    tournamentId: 4,
    name: "Valorant Vortex Cup",
    game: "Valorant",
    description: "Premier 5v5 Valorant single-elimination bracket tournament for college champions.",
    bannerUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop",
    tournamentDate: "2026-10-20",
    startTime: "20:00",
    registrationDeadline: "2026-10-19",
    maxTeams: 16,
    currentTeams: 12,
    entryFee: 750,
    prizePool: 25000,
    status: "OPEN",
    rules: "Standard VCT competitive rulebook. Overtime rules active. Map pick/ban phase before match.",
    organizer: "ETS Official"
  },
  {
    tournamentId: 5,
    name: "Counter-Strike Elite Championship",
    game: "Counter-Strike",
    description: "Tactical CS2 5v5 MR12 tournament with intense map vetoes and prize pool rewards.",
    bannerUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop",
    tournamentDate: "2026-10-25",
    startTime: "18:30",
    registrationDeadline: "2026-10-24",
    maxTeams: 24,
    currentTeams: 18,
    entryFee: 800,
    prizePool: 30000,
    status: "OPEN",
    rules: "Official MR12 competitive settings. Overtime max 6 rounds with $10,000 start budget.",
    organizer: "ETS Official"
  }
];

let registrations = [
  { registrationId: 1, registrationCode: "ETS-REG-2026-1001", tournamentId: 1, teamId: 1, userId: 2, registrationStatus: "CONFIRMED", registrationDate: new Date().toISOString() },
  { registrationId: 2, registrationCode: "ETS-REG-2026-1002", tournamentId: 2, teamId: 4, userId: 5, registrationStatus: "CONFIRMED", registrationDate: new Date().toISOString() },
  { registrationId: 3, registrationCode: "ETS-REG-2026-1003", tournamentId: 4, teamId: 2, userId: 3, registrationStatus: "CONFIRMED", registrationDate: new Date().toISOString() },
];

let payments = [
  { paymentId: 1, registrationId: 1, amount: 500, paymentMethod: "UPI", paymentStatus: "SUCCESS", transactionRef: "TXN_UPI_98412019", paymentDate: new Date().toISOString() },
  { paymentId: 2, registrationId: 2, amount: 600, paymentMethod: "CARD", paymentStatus: "SUCCESS", transactionRef: "TXN_CRD_44120912", paymentDate: new Date().toISOString() },
  { paymentId: 3, registrationId: 3, amount: 750, paymentMethod: "NET_BANKING", paymentStatus: "SUCCESS", transactionRef: "TXN_NB_77182390", paymentDate: new Date().toISOString() },
];

let matches: any[] = [
  // Quarter Finals (Round 1)
  { matchId: 1, tournamentId: 4, round: "QUARTER_FINALS", matchNumber: 1, teamAId: 1, teamAName: "Soul eSports", teamBId: 3, teamBName: "Total Gaming Squad", scoreA: 2, scoreB: 1, winnerTeamId: 1, winnerTeamName: "Soul eSports", status: "COMPLETED", scheduledTime: "2026-10-20 18:00", nextMatchId: 5 },
  { matchId: 2, tournamentId: 4, round: "QUARTER_FINALS", matchNumber: 2, teamAId: 2, teamAName: "Sentinel Prime", teamBId: 4, teamBName: "Shadow Ops", scoreA: 2, scoreB: 0, winnerTeamId: 2, winnerTeamName: "Sentinel Prime", status: "COMPLETED", scheduledTime: "2026-10-20 19:00", nextMatchId: 5 },
  { matchId: 3, tournamentId: 4, round: "QUARTER_FINALS", matchNumber: 3, teamAId: 5, teamAName: "Navi Cadets", teamBId: 1, teamBName: "Soul eSports", scoreA: 1, scoreB: 2, winnerTeamId: 1, winnerTeamName: "Soul eSports", status: "COMPLETED", scheduledTime: "2026-10-20 20:00", nextMatchId: 6 },
  { matchId: 4, tournamentId: 4, round: "QUARTER_FINALS", matchNumber: 4, teamAId: 3, teamAName: "Total Gaming Squad", teamBId: 2, teamBName: "Sentinel Prime", scoreA: 0, scoreB: 2, winnerTeamId: 2, winnerTeamName: "Sentinel Prime", status: "COMPLETED", scheduledTime: "2026-10-20 21:00", nextMatchId: 6 },
  
  // Semi Finals (Round 2)
  { matchId: 5, tournamentId: 4, round: "SEMI_FINALS", matchNumber: 1, teamAId: 1, teamAName: "Soul eSports", teamBId: 2, teamBName: "Sentinel Prime", scoreA: 2, scoreB: 1, winnerTeamId: 1, winnerTeamName: "Soul eSports", status: "COMPLETED", scheduledTime: "2026-10-21 19:00", nextMatchId: 7 },
  { matchId: 6, tournamentId: 4, round: "SEMI_FINALS", matchNumber: 2, teamAId: 1, teamAName: "Soul eSports", teamBId: 2, teamBName: "Sentinel Prime", scoreA: 1, scoreB: 1, winnerTeamId: null, winnerTeamName: null, status: "LIVE", scheduledTime: "2026-10-21 20:30", nextMatchId: 7 },
  
  // Finals (Round 3)
  { matchId: 7, tournamentId: 4, round: "FINAL", matchNumber: 1, teamAId: 1, teamAName: "Soul eSports", teamBId: null, teamBName: "TBD", scoreA: 0, scoreB: 0, winnerTeamId: null, winnerTeamName: null, status: "UPCOMING", scheduledTime: "2026-10-22 20:00", nextMatchId: null }
];

let leaderboard = [
  { rank: 1, playerId: 2, playerName: "Sarah 'Nova' Jenkins", gameId: "NOVA_VAL_07", teamName: "Sentinel Prime", game: "Valorant", matchesPlayed: 24, wins: 20, losses: 4, points: 1850, winRate: 83.3 },
  { rank: 2, playerId: 1, playerName: "Alex 'Viper' Mercer", gameId: "VIPER_PUBG_99", teamName: "Soul eSports", game: "PUBG", matchesPlayed: 30, wins: 22, losses: 8, points: 1720, winRate: 73.3 },
  { rank: 3, playerId: 4, playerName: "Marcus 'Ghost' Vance", gameId: "GHOST_COD_101", teamName: "Shadow Ops", game: "Call of Duty", matchesPlayed: 18, wins: 14, losses: 4, points: 1480, winRate: 77.8 },
  { rank: 4, playerId: 3, playerName: "Rahul 'Phantom' Sharma", gameId: "PHANTOM_FF_88", teamName: "Total Gaming Squad", game: "Free Fire", matchesPlayed: 22, wins: 15, losses: 7, points: 1410, winRate: 68.2 },
  { rank: 5, playerId: 5, playerName: "Elena 'Frost' Rossi", gameId: "FROST_CS_55", teamName: "Navi Cadets", game: "Counter-Strike", matchesPlayed: 16, wins: 11, losses: 5, points: 1290, winRate: 68.8 }
];

let badges = [
  { badgeId: 1, name: "FIRST WIN", description: "Achieved first victory in an ETS official match.", icon: "Trophy", category: "ACHIEVEMENT" },
  { badgeId: 2, name: "TOURNAMENT CHAMPION", description: "Crowned champion of an official ETS tournament.", icon: "Crown", category: "MASTERY" },
  { badgeId: 3, name: "TOP 10", description: "Ranked among the top 10 players on the global leaderboard.", icon: "Medal", category: "RANK" },
  { badgeId: 4, name: "TOP 3", description: "Ranked in the top 3 elite players.", icon: "Award", category: "RANK" },
  { badgeId: 5, name: "10 MATCHES", description: "Completed 10 official tournament matches.", icon: "Flame", category: "ACTIVITY" },
  { badgeId: 6, name: "TEAM PLAYER", description: "Created or joined a team and participated in team tournaments.", icon: "Users", category: "COMMUNITY" }
];

let playerBadges = [
  { playerId: 1, unlockedBadgeIds: [1, 3, 5, 6] },
  { playerId: 2, unlockedBadgeIds: [1, 2, 3, 4, 5, 6] },
  { playerId: 3, unlockedBadgeIds: [1, 5, 6] },
];

let prizes = [
  { prizeId: 1, tournamentId: 1, position: 1, amount: 12000, description: "1st Place Winner - Grand Trophy + Cash" },
  { prizeId: 2, tournamentId: 1, position: 2, amount: 5000, description: "2nd Place Runner Up" },
  { prizeId: 3, tournamentId: 1, position: 3, amount: 3000, description: "3rd Place Bronze Finish" },
  { prizeId: 4, tournamentId: 4, position: 1, amount: 15000, description: "1st Place Valorant Champion" },
  { prizeId: 5, tournamentId: 4, position: 2, amount: 7000, description: "2nd Place Runner Up" },
  { prizeId: 6, tournamentId: 4, position: 3, amount: 3000, description: "3rd Place Bronze" },
];

// API REST ROUTES

// 1. Auth: Login & Register
app.post("/api/login", (req: Request, res: Response) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  const user = users.find(
    (u) => (u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === username.toLowerCase())
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  if (role && user.role !== role) {
    return res.status(403).json({ error: `Access denied. Selected role '${role}' does not match user account.` });
  }

  if (!user.active) {
    return res.status(403).json({ error: "Your account has been deactivated by the administrator." });
  }

  const player = players.find((p) => p.userId === user.userId);
  const userTeam = teams.find((t) => t.members.some((m) => m.playerId === player?.playerId));

  return res.json({
    message: "Login successful",
    user: {
      userId: user.userId,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      playerId: player?.playerId || null,
      gameId: player?.gameId || null,
      teamId: userTeam?.teamId || null,
      teamName: userTeam?.teamName || null,
      avatarUrl: player?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop"
    }
  });
});

app.post("/api/register", (req: Request, res: Response) => {
  const { fullName, username, email, password, confirmPassword, phoneNumber, gameId } = req.body;

  if (!fullName || !username || !email || !password || !gameId) {
    return res.status(400).json({ error: "All required registration fields must be filled." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Password and Confirm Password do not match." });
  }

  if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    return res.status(409).json({ error: "Username already taken. Please choose another." });
  }

  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ error: "An account with this email address already exists." });
  }

  const newUserId = users.length + 1;
  const newPlayerId = players.length + 1;

  const newUser = {
    userId: newUserId,
    fullName,
    username,
    email,
    passwordHash: "hashed_" + password,
    phoneNumber: phoneNumber || "9999999999",
    role: "PLAYER",
    active: true
  };

  const newPlayer = {
    playerId: newPlayerId,
    userId: newUserId,
    gameId,
    teamId: null,
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop"
  };

  users.push(newUser);
  players.push(newPlayer);

  // Add initial stats & leaderboard record
  leaderboard.push({
    rank: leaderboard.length + 1,
    playerId: newPlayerId,
    playerName: fullName,
    gameId,
    teamName: "Free Agent",
    game: "PUBG",
    matchesPlayed: 0,
    wins: 0,
    losses: 0,
    points: 100,
    winRate: 0
  });

  return res.status(201).json({
    message: "Registration successful!",
    user: {
      userId: newUserId,
      fullName: newUser.fullName,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      phoneNumber: newUser.phoneNumber,
      playerId: newPlayerId,
      gameId,
      teamId: null,
      teamName: null,
      avatarUrl: newPlayer.avatarUrl
    }
  });
});

// 2. Users Management (Admin)
app.get("/api/users", (req: Request, res: Response) => {
  const result = users.map(u => {
    const player = players.find(p => p.userId === u.userId);
    const team = teams.find(t => t.members.some(m => m.playerId === player?.playerId));
    return {
      ...u,
      playerId: player?.playerId,
      gameId: player?.gameId,
      teamName: team?.teamName || "Free Agent"
    };
  });
  res.json(result);
});

app.post("/api/users/action", (req: Request, res: Response) => {
  const { userId, action, role } = req.body;
  const user = users.find(u => u.userId === userId);
  if (!user) return res.status(404).json({ error: "User not found." });

  if (action === "toggle_active") {
    user.active = !user.active;
  } else if (action === "change_role") {
    if (role) user.role = role;
  } else if (action === "delete") {
    users = users.filter(u => u.userId !== userId);
  }

  res.json({ message: "User updated successfully.", user });
});

// 3. Tournaments Management
app.get("/api/tournaments", (req: Request, res: Response) => {
  res.json(tournaments);
});

app.post("/api/tournaments", (req: Request, res: Response) => {
  const { name, game, description, bannerUrl, tournamentDate, startTime, registrationDeadline, maxTeams, entryFee, prizePool, rules } = req.body;
  if (!name || !game || !tournamentDate) {
    return res.status(400).json({ error: "Tournament Name, Game, and Date are required." });
  }

  const newId = tournaments.length ? Math.max(...tournaments.map(t => t.tournamentId)) + 1 : 1;
  const newTournament = {
    tournamentId: newId,
    name,
    game,
    description: description || "Official ETS Esports Championship.",
    bannerUrl: bannerUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop",
    tournamentDate,
    startTime: startTime || "18:00",
    registrationDeadline: registrationDeadline || tournamentDate,
    maxTeams: Number(maxTeams) || 16,
    currentTeams: 0,
    entryFee: Number(entryFee) || 0,
    prizePool: Number(prizePool) || 10000,
    status: "OPEN",
    rules: rules || "Standard competitive rulebook.",
    organizer: "ETS Official"
  };

  tournaments.push(newTournament);
  res.status(201).json(newTournament);
});

app.put("/api/tournaments/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const t = tournaments.find(item => item.tournamentId === id);
  if (!t) return res.status(404).json({ error: "Tournament not found." });

  Object.assign(t, req.body);
  res.json(t);
});

app.delete("/api/tournaments/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  tournaments = tournaments.filter(item => item.tournamentId !== id);
  res.json({ message: "Tournament deleted successfully." });
});

// 4. Team Management
app.get("/api/teams", (req: Request, res: Response) => {
  res.json(teams);
});

app.post("/api/teams", (req: Request, res: Response) => {
  const { teamName, teamLogoUrl, game, description, captainPlayerId, username } = req.body;
  if (!teamName || !game || !captainPlayerId) {
    return res.status(400).json({ error: "Team Name, Game, and Captain are required." });
  }

  if (teams.some(t => t.teamName.toLowerCase() === teamName.toLowerCase())) {
    return res.status(409).json({ error: "Team name already exists. Please choose a unique name." });
  }

  const newTeamId = teams.length ? Math.max(...teams.map(t => t.teamId)) + 1 : 1;
  const newTeam = {
    teamId: newTeamId,
    teamName,
    teamLogoUrl: teamLogoUrl || "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&auto=format&fit=crop",
    game,
    description: description || "Competitive esports squad.",
    captainPlayerId: Number(captainPlayerId),
    members: [
      { memberId: 1, playerId: Number(captainPlayerId), username: username || "captain", gameId: "IGN_" + captainPlayerId, role: "CAPTAIN" }
    ]
  };

  teams.push(newTeam);

  // Update captain's player record
  const p = players.find(player => player.playerId === Number(captainPlayerId));
  if (p) p.teamId = newTeamId;

  res.status(201).json(newTeam);
});

app.post("/api/teams/join", (req: Request, res: Response) => {
  const { teamId, playerId, username } = req.body;
  const team = teams.find(t => t.teamId === Number(teamId));
  if (!team) return res.status(404).json({ error: "Team not found." });

  if (team.members.some(m => m.playerId === Number(playerId))) {
    return res.status(400).json({ error: "You are already a member of this team." });
  }

  team.members.push({
    memberId: team.members.length + 1,
    playerId: Number(playerId),
    username: username || "Player",
    gameId: "IGN_" + playerId,
    role: "MEMBER"
  });

  const p = players.find(player => player.playerId === Number(playerId));
  if (p) p.teamId = Number(teamId);

  res.json({ message: "Joined team successfully!", team });
});

// 5. Tournament Registration & Simulated Payment Gateway
app.post("/api/registrations", (req: Request, res: Response) => {
  const { tournamentId, teamId, userId } = req.body;

  const t = tournaments.find(item => item.tournamentId === Number(tournamentId));
  if (!t) return res.status(404).json({ error: "Tournament not found." });

  if (t.status !== "OPEN") {
    return res.status(400).json({ error: `Cannot register. Tournament status is '${t.status}'.` });
  }

  if (t.currentTeams >= t.maxTeams) {
    return res.status(400).json({ error: "Tournament is full. Maximum team capacity reached." });
  }

  const team = teams.find(item => item.teamId === Number(teamId));
  if (!team) return res.status(400).json({ error: "You must create or join a team before registering." });

  if (registrations.some(r => r.tournamentId === Number(tournamentId) && r.teamId === Number(teamId))) {
    return res.status(409).json({ error: "Your team is already registered for this tournament." });
  }

  const regCode = "ETS-REG-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);
  const newReg = {
    registrationId: registrations.length + 1,
    registrationCode: regCode,
    tournamentId: Number(tournamentId),
    teamId: Number(teamId),
    userId: Number(userId),
    registrationStatus: t.entryFee > 0 ? "PENDING" : "CONFIRMED",
    registrationDate: new Date().toISOString()
  };

  registrations.push(newReg);

  if (t.entryFee === 0) {
    t.currentTeams += 1;
  }

  res.status(201).json({
    message: t.entryFee > 0 ? "Registration initiated. Proceed to payment." : "Registration confirmed successfully!",
    registration: newReg,
    requiresPayment: t.entryFee > 0,
    entryFee: t.entryFee
  });
});

app.post("/api/payments/simulate", (req: Request, res: Response) => {
  const { registrationId, amount, paymentMethod } = req.body;
  const reg = registrations.find(r => r.registrationId === Number(registrationId));
  if (!reg) return res.status(404).json({ error: "Registration record not found." });

  const txnRef = "TXN_" + (paymentMethod || "UPI") + "_" + Math.floor(10000000 + Math.random() * 90000000);

  const payment = {
    paymentId: payments.length + 1,
    registrationId: Number(registrationId),
    amount: Number(amount) || 0,
    paymentMethod: paymentMethod || "UPI",
    paymentStatus: "SUCCESS",
    transactionRef: txnRef,
    paymentDate: new Date().toISOString()
  };

  payments.push(payment);
  reg.registrationStatus = "CONFIRMED";

  const t = tournaments.find(item => item.tournamentId === reg.tournamentId);
  if (t) t.currentTeams += 1;

  res.json({
    message: "Payment successful! Registration confirmed.",
    payment,
    registrationCode: reg.registrationCode
  });
});

app.get("/api/registrations", (req: Request, res: Response) => {
  const result = registrations.map(r => {
    const t = tournaments.find(item => item.tournamentId === r.tournamentId);
    const team = teams.find(item => item.teamId === r.teamId);
    const p = payments.find(pay => pay.registrationId === r.registrationId);
    return {
      ...r,
      tournamentName: t?.name || "Unknown Tournament",
      game: t?.game || "All Games",
      teamName: team?.teamName || "Unknown Team",
      entryFee: t?.entryFee || 0,
      paymentMethod: p?.paymentMethod || "N/A",
      transactionRef: p?.transactionRef || "N/A"
    };
  });
  res.json(result);
});

app.get("/api/registrations/user/:userId", (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const result = registrations
    .filter(r => r.userId === userId)
    .map(r => {
      const t = tournaments.find(item => item.tournamentId === r.tournamentId);
      const team = teams.find(item => item.teamId === r.teamId);
      const p = payments.find(pay => pay.registrationId === r.registrationId);
      return {
        ...r,
        tournamentName: t?.name || "Unknown Tournament",
        game: t?.game || "All Games",
        teamName: team?.teamName || "Unknown Team",
        entryFee: t?.entryFee || 0,
        paymentMethod: p?.paymentMethod || "N/A",
        transactionRef: p?.transactionRef || "N/A"
      };
    });
  res.json(result);
});

// 6. Matches & Bracket Single Elimination Progression
app.get("/api/matches", (req: Request, res: Response) => {
  res.json(matches);
});

app.get("/api/matches/:tournamentId", (req: Request, res: Response) => {
  const tId = Number(req.params.tournamentId);
  const filtered = matches.filter(m => m.tournamentId === tId);
  res.json(filtered.length > 0 ? filtered : matches);
});

app.post("/api/matches", (req: Request, res: Response) => {
  const { tournamentId, round, matchNumber, teamAId, teamBId, scheduledTime } = req.body;
  const teamA = teams.find(t => t.teamId === Number(teamAId));
  const teamB = teams.find(t => t.teamId === Number(teamBId));

  const newMatch = {
    matchId: matches.length ? Math.max(...matches.map(m => m.matchId)) + 1 : 1,
    tournamentId: Number(tournamentId),
    round: round || "QUARTER_FINALS",
    matchNumber: Number(matchNumber) || 1,
    teamAId: teamAId ? Number(teamAId) : null,
    teamAName: teamA ? teamA.teamName : "TBD",
    teamBId: teamBId ? Number(teamBId) : null,
    teamBName: teamB ? teamB.teamName : "TBD",
    scoreA: 0,
    scoreB: 0,
    winnerTeamId: null,
    winnerTeamName: null,
    status: "UPCOMING",
    scheduledTime: scheduledTime || new Date().toISOString(),
    nextMatchId: null
  };

  matches.push(newMatch);
  res.status(201).json(newMatch);
});

app.put("/api/matches/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const m = matches.find(item => item.matchId === id);
  if (!m) return res.status(404).json({ error: "Match not found." });

  const { scoreA, scoreB, winnerTeamId, status } = req.body;

  if (scoreA !== undefined) m.scoreA = Number(scoreA);
  if (scoreB !== undefined) m.scoreB = Number(scoreB);
  if (status !== undefined) m.status = status;

  if (winnerTeamId !== undefined) {
    m.winnerTeamId = Number(winnerTeamId);
    const winTeam = teams.find(t => t.teamId === Number(winnerTeamId));
    m.winnerTeamName = winTeam ? winTeam.teamName : "Winner";

    // Advance winner to next match in bracket if nextMatchId exists
    if (m.nextMatchId) {
      const nextM = matches.find(item => item.matchId === m.nextMatchId);
      if (nextM) {
        if (!nextM.teamAId) {
          nextM.teamAId = m.winnerTeamId;
          nextM.teamAName = m.winnerTeamName;
        } else if (!nextM.teamBId && nextM.teamAId !== m.winnerTeamId) {
          nextM.teamBId = m.winnerTeamId;
          nextM.teamBName = m.winnerTeamName;
        }
      }
    }
  }

  res.json({ message: "Match result updated successfully and bracket advanced!", match: m });
});

// 7. Leaderboards & Stats & Badges & Prizes
app.get("/api/leaderboard", (req: Request, res: Response) => {
  res.json(leaderboard);
});

app.get("/api/badges", (req: Request, res: Response) => {
  res.json(badges);
});

app.get("/api/prizes/:tournamentId", (req: Request, res: Response) => {
  const tId = Number(req.params.tournamentId);
  const result = prizes.filter(p => p.tournamentId === tId);
  res.json(result);
});

// 8. Report Generation (Java File I/O Simulation)
app.post("/api/reports/generate", (req: Request, res: Response) => {
  const { reportType } = req.body;
  const reportsDir = path.join(process.cwd(), "reports");
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const timestamp = Date.now();
  const filename = `${reportType}_Report_${timestamp}.txt`;
  const filePath = path.join(reportsDir, filename);

  let content = "========================================================================\n";
  content += "                ESPORTS TOURNAMENT SYSTEM (ETS)                         \n";
  content += `                      ${reportType.toUpperCase()} REPORT                         \n`;
  content += "========================================================================\n";
  content += `Generated On: ${new Date().toLocaleString()}\n\n`;

  if (reportType === "Tournament") {
    content += `Total Tournaments: ${tournaments.length}\n\n`;
    tournaments.forEach(t => {
      content += `ID: ${t.tournamentId} | ${t.name} [Game: ${t.game}]\n`;
      content += `Status: ${t.status} | Date: ${t.tournamentDate} @ ${t.startTime}\n`;
      content += `Registered Teams: ${t.currentTeams}/${t.maxTeams} | Entry Fee: ₹${t.entryFee} | Prize Pool: ₹${t.prizePool}\n`;
      content += "------------------------------------------------------------------------\n";
    });
  } else if (reportType === "Leaderboard") {
    content += "RANK  PLAYER                     TEAM             GAME         WINS  LOSSES  POINTS\n";
    content += "------------------------------------------------------------------------\n";
    leaderboard.forEach(l => {
      content += `#${l.rank}    ${l.playerName.padEnd(25)} ${l.teamName.padEnd(16)} ${l.game.padEnd(12)} ${l.wins}     ${l.losses}       ${l.points}\n`;
    });
  } else if (reportType === "Registration") {
    content += `Total Confirmed Registrations: ${registrations.length}\n\n`;
    registrations.forEach(r => {
      const t = tournaments.find(item => item.tournamentId === r.tournamentId);
      const team = teams.find(item => item.teamId === r.teamId);
      content += `Code: ${r.registrationCode} | Tournament: ${t?.name} | Team: ${team?.teamName} | Status: ${r.registrationStatus}\n`;
    });
  } else {
    content += `Summary of ${reportType} data processed by ETS System Services.\n`;
  }

  content += "========================================================================\n";
  content += "End of Report\n";

  fs.writeFileSync(filePath, content, "utf8");

  res.json({
    message: "Report generated successfully!",
    filename,
    content,
    downloadUrl: `/api/reports/download/${filename}`
  });
});

app.get("/api/reports/download/:filename", (req: Request, res: Response) => {
  const filename = req.params.filename;
  const filePath = path.join(process.cwd(), "reports", filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send("Report file not found.");
  }
});

// Vite Middleware Integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ETS Server] Esports Tournament System backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
