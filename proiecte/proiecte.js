/*
add
getall
getbypref([nume_preferinta]) -> de gandit
getByCreatedAt->desc


*/

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { datab } from "../firebase.js";
import { upload_files } from "../utils/upload_aws.js";

const files = [
  "business_model",
  "cover",
  "git",
  "mvp",
  "tokenomics",
  "video",
  "whitepaper",
];

const addProject = async (req, res) => {
  const { user } = req.body;
  if (user) {
    const data = {
      created_at: new Date().getTime() / 1000,
      updated_at: new Date().getTime() / 1000,
      by_user: user,
      title: req.body.title,
      motto: req.body.motto,
      category: req.body.category,
      token_supply: req.body.token_supply,
      dev_stage: req.body.dev_stage,
      market_size: req.body.market_size,
      founding_status: req.body.founding_status,
      partnerships: req.body.partnerships,
      description: req.body.description,
      key_metrics: JSON.parse(req.body.key_metrics),
      sec_comp: JSON.parse(req.body.sec_comp),
      team_info: JSON.parse(req.body.team_info),
      team: { core: [], tech: [], advisory: [] },
      whitepaper: "",
      tokenomics: "",
      roadmap: "",
      business_model: "",
      git: "",
      mvp: "",
      cover: "",
      video: "",
    };
    console.log("===========================================");
    data.whitepaper = await upload_files(req.files["whitepaper"]);
    data.tokenomics = await upload_files(req.files["tokenomics"]);
    data.roadmap = await upload_files(req.files["roadmap"]);
    data.business_model = await upload_files(req.files["business_model"]);
    data.git = await upload_files(req.files["git"]);
    data.mvp = await upload_files(req.files["mvp"]);
    data.cover = await upload_files(req.files["cover"]);
    data.video = await upload_files(req.files["video"]);

    for (let i = 0; i < req.files["teamcore[]"].length; i++) {
      let file = req.files["teamcore[]"][i];
      data.team.core[i] = await upload_files(file);
    }

    for (let i = 0; i < req.files["teamtech[]"].length; i++) {
      let file = req.files["teamtech[]"][i];
      data.team.tech[i] = await upload_files(file);
    }

    for (let i = 0; i < req.files["teamad[]"].length; i++) {
      let file = req.files["teamad[]"][i];
      data.team.advisory[i] = await upload_files(file);
    }

    console.log(data);
    try {
      const proiect = await addDoc(collection(datab, "projects"), data);
      res.status(200).json({ id: proiect.id });
    } catch (error) {
      console.log("error: ", error);
      res.status(500).json({ message: error });
    }
  } else {
    res.status(401).json({ message: "Not logged" });
  }
};

const updateProject = async (req, res) => {
  const { updates, id } = req.body;
  const ref = doc(datab, "projects", id);
  const proj = await getDoc(ref);
  let proj_data = proj.data();
  const update_ok = JSON.parse(updates);

  for (let update of update_ok) {
    const key = Object.keys(update)[0];
    const value = Object.values(update)[0];
    const posible = ["desc", "subtitle", "name", "link"];
    if (posible.includes(key)) {
      const nest = Object.keys(update)[1];
      const index = Object.values(update)[1];
      proj_data[nest][Number(index)][key] = value;
    } else {
      proj_data[key] = value;
    }
  }

  if (req.files != null) {
    const keys = Object.keys(req.files);
    for (let key of keys) {
      const file = req.files[key];
      // console.log(file.name)
      const new_key = key.replace(/\d+/g, "");

      if (!files.includes(new_key)) {
        const number = key.match(/(\d+)/)[0];
        const link = await upload_files(file);
        proj_data["team"][new_key][number] = link;
      } else {
        const link = await upload_files(file);
        proj_data[new_key] = link;
      }
    }
  }

  proj_data["updated_at"] = new Date().getTime() / 1000;
  try {
    await updateDoc(ref, proj_data);
    res.status(200).json(proj_data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Smth went wrong" });
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.body;
  const ref = doc(datab, "projects", id);
  await deleteDoc(ref);
  res.status(200).json({ message: "Deleted" });
};

const addToWatchList = async (req, res) => {
  const { uid, proj_id } = req.body;

  try {
    const ref = doc(datab, "users", uid);
    const user = await getDoc(ref);
    let data = user.data();
    if (data.watchlist.some((t) => t == proj_id))
      res.status(200).json({ message: "deja e adaugat" });
    data.watchlist.unshift(proj_id);

    await updateDoc(ref, data);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

const removeFromWatchList = async (req, res) => {
  const { uid, proj_id } = req.body;
  try {
    const ref = doc(datab, "users", uid);
    const user = await getDoc(ref);
    let data = user.data();
    if (!data.watchlist.some((t) => t == proj_id))
      res.status(200).json({ message: "Nu era adaugat!" });
    // data.watchlist.unshift(proj_id);
    const index = data.watchlist.indexOf(proj_id);
    if (index > -1) {
      data.watchlist.splice(index, 1);
    }
    console.log(data);

    await updateDoc(ref, data);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

const getAllProjectsDesc = async (req, res) => {
  const docs = await getDocs(
    query(collection(datab, "projects"), orderBy("created_at", "desc"))
  );
  const data = [];
  docs.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });
  res.status(200).json(data);
};

const getProjectById = async (req, res) => {
  const { id } = req.params;
  const ref = doc(datab, "projects", id);
  const proiect = await getDoc(ref);
  res.status(200).json({ id: proiect.id, ...proiect.data() });
};

const getProjectsByTitle = async (req, res) => {
  const { title } = req.params;
  const ref = collection(datab, "projects");
  const q = query(
    ref,
    where("title", ">=", title),
    where("title", "<=", title + "\uf8ff")
  );
  const proiects = await getDocs(q);
  let data = [];
  proiects.forEach((proiect) => {
    data.push({ id: proiect.id, ...proiect.data() });
  });
  console.log(data);
  res.status(200).json(data);
};

export {
  addProject,
  addToWatchList,
  getAllProjectsDesc,
  updateProject,
  deleteProject,
  removeFromWatchList,
  getProjectById,
  getProjectsByTitle,
};