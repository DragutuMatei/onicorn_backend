import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase-admin.js";
import { datab } from "../firebase.js";
import { upload_files } from "../utils/upload_aws.js";

/**
 * Registers a new user with Firebase Authentication and Firestore.
 *
 * @param {Object} req - The request object containing `email`, `password`, and `displayName`.
 * @param {Object} res - The response object used to send the response back to the client.
 * @returns {Object} A JSON object containing the user ID and email, or an error message.
 */
const register = async (req, res) => {
  const { email, password, displayName } = req.body;
  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
    });
    await db
      .collection("users")
      .doc(userRecord.uid)
      .set({
        uid: userRecord.uid,
        email: userRecord.email,
        metrics: {},
        recent_activiti: [],
        watch: {},
        watchlist: [],
        cover: "",
        profile: "",
        name: userRecord.displayName || "",
        company: "",
        desc: "",
        website: "",
        linkdin: "",
        twitter: "",
        preferences: {
          categories: [],
          project_stage: [],
          founding_stage: [],
          market_cap: [],
        },
      })
      .then((res) => {
        console.log(res);
      });
    res.status(201).send({ uid: userRecord.uid, email: userRecord.email });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

/**
 * Logs in a user by verifying their ID token.
 *
 * @param {Object} req - The request object containing `token`.
 * @param {Object} res - The response object used to send the response back to the client.
 * @returns {Object} A JSON object containing user data, or an error message.
 */
const login = async (req, res) => {
  const idToken = req.body.token;
  // const refreshToken = req.body.refresh;

  try {
    // Verify the ID token from the frontend
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Optionally, fetch user details from Firestore or Firebase Authentication
    const userRecord = await auth.getUser(uid);
    const ref = doc(datab, "users", uid);
    const user = await getDoc(ref);
    const user_data = user.data();

    for (let i = 0; i < user_data.watchlist.length; i++) {
      let id = user_data.watchlist[i];
      const proj_ref = doc(datab, "projects", id);
      const project = await getDoc(proj_ref);
      const replacement = { id: project.id, ...project.data() };
      user_data.watchlist[i] = replacement;
    }

    res.status(200).send({
      ...userRecord,
      ...user_data,
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({ message: "Invalid token", error: error.message });
  }
};

/**
 * Checks if a user is logged in by verifying their ID token.
 *
 * @param {Object} req - The request object containing the authorization header with the ID token.
 * @param {Object} res - The response object used to send the response back to the client.
 * @returns {Object} A JSON object confirming login status or an error message.
 */
const checkIfLogged = async (req, res) => {
  const idToken = req.headers.authorization;

  console.log(idToken);
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    res.status(200).send({ uid: decodedToken.uid, loggedIn: true });
  } catch (error) {
    console.log(error);
    res.status(401).send({ loggedIn: false, error: error.message });
  }
};

/**
 * Retrieves user data by UID from token.
 *
 * @param {Object} req - The request object containing the authorization header with the ID token.
 * @param {Object} res - The response object used to send the response back to the client.
 * @returns {Object} A JSON object containing user data or an error message.
 */
const getUser = async (req, res) => {
  // const { uid } = req.params;
  const idToken = req.headers.authorization;

  console.log(idToken);
  let logged = false;
  let decodedToken;
  try {
    decodedToken = await auth.verifyIdToken(idToken);
    logged = true;
    const uid = decodedToken.uid;

    try {
      const userRecord = await auth.getUser(uid);
      console.log(userRecord);
      const ref = doc(datab, "users", uid);
      const user = await getDoc(ref);
      const user_data = user.data();

      for (let i = 0; i < user_data.watchlist.length; i++) {
        let id = user_data.watchlist[i];
        const proj_ref = doc(datab, "projects", id);
        const project = await getDoc(proj_ref);
        const replacement = { id: project.id, ...project.data() };
        user_data.watchlist[i] = replacement;
      }

      for (let i = 0; i < user_data.recent_activiti.length; i++) {
        let id = user_data.recent_activiti[i];
        const proj_ref = doc(datab, "projects", id);
        const project = await getDoc(proj_ref);
        const replacement = { id: project.id, ...project.data() };
        user_data.recent_activiti[i] = replacement;
      }

      res.status(200).send({ ...userRecord, ...user_data });
    } catch (error) {
      res.status(404).send(error.message);
    }
  } catch (error) {
    res.status(401).send({ loggedIn: false, error: error.message });
  }
};

/**
 * Refreshes an ID token using a refresh token.
 *
 * @param {Object} req - The request object containing `refreshToken`.
 * @param {Object} res - The response object used to send the response back to the client.
 * @returns {Object} A JSON object containing the new ID token, refresh token, and expiry time, or an error message.
 */
const refreshToken = async (req, res) => {
  console.log("a incercat");
  try {
    const response = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=AIzaSyAkZKiZbodKgA6Kg-tmGxnpUEVF4ly8EfI`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "refresh_token",
          refresh_token: req.body.refreshToken,
        }),
      }
    );

    const data = await response.json();

    const newIdToken = data.id_token;
    const newRefreshToken = data.refresh_token;
    const expiresIn = data.expires_in;
    res
      .status(200)
      .json({ accessToken: newIdToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error("Error refreshing ID token:", error);
    res.status(500).json({ ok: false });
  }
};

/**
 * Updates a user's profile data in Firestore.
 *
 * @param {Object} req - The request object containing `id` (user ID) and `updates` (JSON string of updates).
 * @param {Object} res - The response object used to send the response back to the client.
 * @returns {Object} A JSON object confirming the update or an error message.
 */
const updateUserProfile = async (req, res) => {
  const { id, updates } = req.body;
  const update_ok = JSON.parse(updates);
  const ref = doc(datab, "users", id);
  const user = await getDoc(ref);
  let user_data = user.data();

  for (const update of update_ok) {
    const key = Object.keys(update)[0];
    const value = Object.values(update)[0];
    const posibilities = [
      "categories",
      "founding_stage",
      "market_cap",
      "project_stage",
    ];
    if (posibilities.includes(key)) {
      user_data["preferences"][key] = value;
    } else if (key === "recent_activiti") {
      user_data[key].unshift(value);
    } else if (key !== "watchlist") {
      user_data[key] = value;
    }

    if (req.files != null) {
      const keys = Object.keys(req.files);
      for (let key of keys) {
        console.log(key);
        const img = await upload_files(req.files[key]);
        user_data[key] = img;
      }
    }
  }
  try {
    await updateDoc(ref, user_data);
    res.status(200).json({ message: "User updated" });
  } catch (error) {
    res.status(500).json({ message: "Smth went wrong" });
  }
};

export {
  register,
  login,
  checkIfLogged,
  getUser,
  refreshToken,
  updateUserProfile,
};
