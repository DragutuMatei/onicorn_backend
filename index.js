// server.js
import express from "express";
import bodyParser from "body-parser";
import { auth, db } from "./firebase-admin.js";
import {
  refreshToken,
  register,
  login,
  checkIfLogged,
  getUser,
  updateUserProfile,
} from "./auth/auth.js";
import {
  addProject,
  addToWatchList,
  deleteProject,
  getAllProjectsDesc,
  getProjectById,
  getProjectsByTitle,
  removeFromWatchList,
  updateProject,
} from "./proiecte/proiecte.js";
import fileUpload from "express-fileupload";

const app = express();

app.use(fileUpload());
// app.use(bodyParser.json({ limit: "15000000mb" }));
// app.use(
//   bodyParser.urlencoded({
//     limit: "15000000mb",
//     extended: true,
//     parameterLimit: 50000000,
//   })
// );
// app.use(bodyParser.text({ limit: "15000000mb" }));

// app.use(express.json({ limit: "1500mb" }));
// app.use(express.urlencoded({ limit: "1500mb" }));

app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  // res.setHeader("Access-Control-Allow-Origin", "https://osfiir.ro");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});

app.post("/register", register);
app.post("/login", login);
app.post("/checkIfLogged", checkIfLogged);
// app.get("/getUser/:uid", getUser);
app.get("/getUser", getUser);
app.post("/refreshToken", refreshToken);
app.post("/updateUserProfile", updateUserProfile);

app.post("/addProject", addProject);
app.post("/addToWatchList", addToWatchList);
app.get("/getAllProjectsDesc", getAllProjectsDesc);
app.post("/updateProject", updateProject);
app.post("/deleteProject", deleteProject);
app.post("/removeFromWatchList", removeFromWatchList);
app.get("/getProjectById/:id", getProjectById);
app.get("/getProjectsByTitle/:title", getProjectsByTitle);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
