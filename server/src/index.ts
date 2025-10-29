import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory state storage
let globalState: Record<string, any> = {};

// REST API Endpoints
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/state", (req: Request, res: Response) => {
  res.json({ state: globalState });
});

app.post("/api/state", (req: Request, res: Response) => {
  const updates = req.body;

  // Merge updates into global state
  globalState = {
    ...globalState,
    ...updates,
  };

  // Broadcast state change to all connected clients
  io.emit("state-update", globalState);

  res.json({
    success: true,
    state: globalState,
  });
});

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Send current state to newly connected client
  socket.emit("state-sync", globalState);

  // Handle state updates from clients
  socket.on("update-state", (updates: Record<string, any>) => {
    globalState = {
      ...globalState,
      ...updates,
    };

    console.log(`Received state update from client ${socket.id}:`, updates);

    // Broadcast to all clients including sender
    io.emit("state-update", globalState);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`WebSocket server ready for connections`);
});
