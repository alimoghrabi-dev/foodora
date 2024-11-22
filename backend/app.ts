import express, { Request, Response } from "express";
import { config } from "dotenv";
import cors from "cors";
import ConnectToDatabase from "./utils/dbConnect.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import applyRoutes from "./routes/apply.routes.js";
import { createServer } from "node:http";
import { Server } from "socket.io";
import passport from "passport";
import restaurantRoutes from "./routes/restaurant.routes.js";
import orderRoutes from "./routes/order.routes.js";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import flash from "connect-flash";
import User from "./models/user.model.js";
import { generateToken } from "./utils/token.js";
config();

const app = express();
const server = createServer(app);

const origin = ["http://localhost:5173", "http://localhost:3000"];

export const io = new Server(server, {
  cors: {
    origin,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());

const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? "" : allowedOrigins,
    credentials: true,
  })
);

app.use(
  session({
    secret: "1419y7289u2du1hdoijaof3",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
    },
  })
);

const PORT = process.env.PORT || 5000;

ConnectToDatabase()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

io.on("connection", (socket) => {
  console.log(`Web socket connected: ${socket.connected}`);

  socket.on("disconnect", () => {
    console.log("Web socket disconnected");
  });
});

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_AUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async function (accessToken: any, refreshToken: any, profile: any, done) {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            name: profile.displayName,
            googleId: profile.id,
            email: profile.emails[0].value,
            isEmailVerified: profile.emails[0].verified,
          });

          await user.save();
        }

        const token = generateToken(user._id as string);

        return done(null, { user, token });
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user || null));

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  async (req: Request, res: Response) => {
    //@ts-ignore
    const { token } = req.user;

    res.redirect(`http://localhost:5173?google_token=${token}`);
  }
);

app.get("/auth/user", (req, res) => {
  res.json(req.user || null);
});

app.get("/logout", (req, res) => {
  req.logout(() => res.redirect("http://localhost:5173"));
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/apply", applyRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/order", orderRoutes);
