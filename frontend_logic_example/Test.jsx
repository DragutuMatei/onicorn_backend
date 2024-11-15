import React, { useEffect, useState } from "react";
import axios from "axios";
import { signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Link } from "react-router-dom";

const axx = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "content-type": "application/json",
  },
  withCredentials: true,
});

const firebaseConfig = {
  apiKey: "AIzaSyAkZKiZbodKgA6Kg-tmGxnpUEVF4ly8EfI",
  authDomain: "onicorn-bdf8b.firebaseapp.com",
  projectId: "onicorn-bdf8b",
  storageBucket: "onicorn-bdf8b.firebasestorage.app",
  messagingSenderId: "742812011300",
  appId: "1:742812011300:web:1a8025912899b1fc5641b1",
  measurementId: "G-8M892HTVKN",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function Test() {
  const [title, setTitle] = useState("");
  const [motto, setMotto] = useState("");
  const [category, setCategory] = useState("");
  const [tokenSupply, setTokenSupply] = useState("");
  const [devStage, setDevStage] = useState("");
  const [marketSize, setMarketSize] = useState("");
  const [foundingStatus, setFoundingStatus] = useState("");
  const [partnerships, setPartnerships] = useState("");
  const [description, setDescription] = useState("");

  // File fields
  const [teamCore1, setTeamCore1] = useState("");
  const [teamCore2, setTeamCore2] = useState("");
  const [teamTech1, setTeamTech1] = useState("");
  const [teamTech2, setTeamTech2] = useState("");
  const [teamAdvisory1, setTeamAdvisory1] = useState("");
  const [teamAdvisory2, setTeamAdvisory2] = useState("");
  const [whitepaper, setWhitepaper] = useState("");
  const [tokenomics, setTokenomics] = useState("");
  const [roadmap, setRoadmap] = useState("");
  const [businessModel, setBusinessModel] = useState("");
  const [git, setGit] = useState("");
  const [mvp, setMvp] = useState("");
  const [cover, setCover] = useState("");
  const [video, setVideo] = useState("");

  const send = async () => {
    await axios
      .post(
        "http://localhost:3001/addProject",
        {
          user: "eJVpPDaYlySuHEr7y6aEr2dqeJi1",
          title,
          motto,
          category,
          token_supply: tokenSupply,
          dev_stage: devStage,
          market_size: marketSize,
          founding_status: foundingStatus,
          partnerships,
          description,
          key_metrics: JSON.stringify([
            { subtitle: "token suply", desc: "sa odosidhaos hoash dohas odh" },
            {
              subtitle: "token suply2222222",
              desc: "sa odosidhaos hoash dohas 22222222222222222222odh",
            },
            {
              subtitle: "token 333333333",
              desc: "sa odosidha3333333333333333333os hoash dohas odh",
            },
            {
              subtitle: "toke444444444444",
              desc: "44444444444sa odosidhaos hoash dohas odh",
            },
          ]),
          sec_comp: JSON.stringify([
            {
              subtitle: "kasdjnkasnjd111111",
              desc: "kjdkasdjnalskd las dlkas dlkasnd lkasndlas",
            },
            {
              subtitle: "kasdjnkasnjd222222",
              desc: "kjdkasdjnalskd las dlkas dlkasnd lkasndlas",
            },
            {
              subtitle: "kasdjnkasnjd333333",
              desc: "kjdkasdjnalskd las dlkas dlkasnd lkasndlas",
            },
          ]),
          team_info: JSON.stringify({
            core: [
              {
                name: "matei",
                link: "https://google.com",
              },
              {
                name: "matei2",
                link: "https://google.com",
              },
            ],
            tech: [
              {
                name: "mateiT",
                link: "https://google.com",
              },
              {
                name: "mateitech",
                link: "https://google.com",
              },
            ],
            advisory: [
              {
                name: "mateiA",
                link: "https://google.com",
              },
              {
                name: "mateiad",
                link: "https://google.com",
              },
            ],
          }),
          whitepaper,
          tokenomics,
          roadmap,
          business_model: businessModel,
          teamcore: [teamCore1, teamCore2],
          teamtech: [teamTech1, teamTech2],
          teamad: [teamAdvisory1, teamAdvisory2],
          git,
          mvp,
          cover,
          video,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        console.log(res);
      });
  };

  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        pass
      );
      const user = userCredential.user;
      const refreshToken = user.refreshToken;
      const idToken = await user.getIdToken();
      localStorage.setItem("idToken", idToken);
      localStorage.setItem("refreshToken", refreshToken);
      const response = await axios.post("http://localhost:3001/login", {
        token: idToken,
      });
      alert("Login successful! " + JSON.stringify(response.data));
    } catch (error) {
      alert("Error logging in: " + error.message);
    }
  };
  const [uid, setUid] = useState("");
  const checkUser = async () => {
    await axx
      .post(
        `/checkIfLogged`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("idToken"),
          },
        }
      )
      .then((res) => {
        console.log(res);
        setUid(res.data.uid);
      });
  };
  const [final, setFinal] = useState();
  const getUser = async () => {
    await axx
      .get(`/getUser`, {
        headers: {
          Authorization: localStorage.getItem("idToken"),
        },
      })
      .then((res) => {
        console.log(res.data.watchlist);
        setFinal(res.data);
      })
      .catch(async (er) => {
        await axx
          .post("/refreshToken", {
            refreshToken: localStorage.getItem("refreshToken"),
          })
          .then((res) => {
            localStorage.setItem("idToken", res.data.accessToken);
            localStorage.setItem("refreshToken", res.data.refreshToken);
          });
      });
  };
  const register = async () => {
    await axx
      .post("/register", {
        email: email,
        displayName: user,
        password: pass,
      })
      .then((res) => {
        console.log(res);
      });
  };
  useEffect(() => {
    getAll();
    getUser();
  }, []);
  const [data, setData] = useState([]);
  const getAll = async () => {
    await axx.get("/getAllProjectsDesc").then((res) => {
      setData(res.data);
    });
  };

  const addtow = async (id) => {
    await axx
      .post("/addToWatchList", {
        uid: final.uid,
        proj_id: id,
      })
      .then((res) => {
        console.log(res);
      });
  };
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const [update_show, setUpdateShow] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState();

  const updatefct = async () => {
    console.log(teamCore2, git);
    await axx
      .post(
        "/updateProject",
        {
          id: currentProjectId,
          updates: JSON.stringify([
            // { title: title },
            // { category: category },
            // { dev_stage: devStage },
            { desc: "ooooooooooooo", key_metrics: 1 },
          ]),
          // core1: teamCore2,
          // git: git,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        console.log(res);
      });
  };

  const deleteProject = async (id) => {
    await axx.post("/deleteProject", { id }).then((res) => {
      console.log(res);
    });
  };

  const removeFromWatchList = async (id) => {
    await axx
      .post("/removeFromWatchList", {
        proj_id: id,
        uid: final.uid,
      })
      .then((res) => {
        console.log(res);
      });
  };

  const [s, setSearch] = useState("");
  const search = async () => {
    await axx.get(`/getProjectsByTitle/${s}`).then((res) => {
      console.log(res.data);
      setData(res.data);
    });
  };
  const [name, setName] = useState("");

  // State for checkboxes
  const [categories, setCategories] = useState({
    btc: false,
    rpi: false,
    idk: false,
  });

  const [projectStage, setProjectStage] = useState({
    start2: false,
    updatessss: false,
    start3: false,
  });

  // State for files as base64 strings
  const [user_cover, setUserCover] = useState(null);
  const [profile, setProfile] = useState(null);

  // Handlers for text input
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  // Handlers for category checkboxes
  const handleCategoryChange = (e) => {
    const { name, checked } = e.target;
    setCategories((prev) => ({ ...prev, [name]: checked }));
  };

  // Handlers for project stage checkboxes
  const handleProjectStageChange = (e) => {
    const { name, checked } = e.target;
    setProjectStage((prev) => ({ ...prev, [name]: checked }));
  };

  const updateUser = async () => {
    console.log("Adsad")
    await axx
      .post(
        "/updateUserProfile",
        {
          id: final.uid,
          updates: JSON.stringify([
            { name: name },
            { categories: categories },
            { project_stage: projectStage },
          ]),
          cover:user_cover,
          profile:profile,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        console.log(res);
      });
  };
  return (
    <div style={{ background: "red" }}>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <input
        type="email"
        id="user-input"
        onChange={(event) => {
          setEmail(event.target.value.trim());
        }}
        placeholder="Input your email here"
      />
      <input
        type="password"
        id="pass-input"
        onChange={(event) => {
          setPass(event.target.value.trim());
        }}
        placeholder="Input password here"
      />
      <button onClick={login}>login</button>
      <button onClick={register}>register</button>
      <button onClick={checkUser}>checkIfLogged</button>
      <button onClick={getUser}>get USER</button>
      <button
        onClick={() => {
          localStorage.removeItem("idToken");
        }}
      >
        logout
      </button>
      <br />
      <br />
      <br />
      <br />
      <br />
      {final && <h3>Logged as: {final.email}</h3>}
      <br />
      <br />{" "}
      <input
        type="text"
        placeholder="name"
        value={name}
        onChange={handleNameChange}
      />
      {/* Categories checkboxes */}
      <h4>Categories</h4>
      <label>
        btc
        <input
          type="checkbox"
          name="btc"
          checked={categories.btc}
          onChange={handleCategoryChange}
        />
      </label>
      <label>
        rpi
        <input
          type="checkbox"
          name="rpi"
          checked={categories.rpi}
          onChange={handleCategoryChange}
        />
      </label>
      <label>
        idk
        <input
          type="checkbox"
          name="idk"
          checked={categories.idk}
          onChange={handleCategoryChange}
        />
      </label>
      {/* Project Stage checkboxes */}
      <h4>Project Stage</h4>
      <label>
        start2
        <input
          type="checkbox"
          name="start2"
          checked={projectStage.start2}
          onChange={handleProjectStageChange}
        />
      </label>
      <label>
        updatessss
        <input
          type="checkbox"
          name="updatessss"
          checked={projectStage.updatessss}
          onChange={handleProjectStageChange}
        />
      </label>
      <label>
        start3
        <input
          type="checkbox"
          name="start3"
          checked={projectStage.start3}
          onChange={handleProjectStageChange}
        />
      </label>
      {/* File inputs */}
      <h4>Cover</h4>
      <input type="file" onChange={(e) => setUserCover(e.target.files[0])} />
      <h4>Profile</h4>
      <input type="file" onChange={(e) => setProfile(e.target.files[0])} />
      <button onClick={updateUser}>update user</button>
      <br />
      <br />
      <div className="add">
        <input
          type="text"
          placeholder="user"
          value={"eJVpPDaYlySuHEr7y6aEr2dqeJi1"}
        />{" "}
        <input
          type="text"
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="motto"
          value={motto}
          onChange={(e) => setMotto(e.target.value)}
        />
        <input
          type="text"
          placeholder="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="text"
          placeholder="token_supply"
          value={tokenSupply}
          onChange={(e) => setTokenSupply(e.target.value)}
        />
        <input
          type="text"
          placeholder="dev_stage"
          value={devStage}
          onChange={(e) => setDevStage(e.target.value)}
        />
        <input
          type="text"
          placeholder="market_size"
          value={marketSize}
          onChange={(e) => setMarketSize(e.target.value)}
        />
        <input
          type="text"
          placeholder="founding_status"
          value={foundingStatus}
          onChange={(e) => setFoundingStatus(e.target.value)}
        />
        <input
          type="text"
          placeholder="partnerships"
          value={partnerships}
          onChange={(e) => setPartnerships(e.target.value)}
        />
        <input
          type="text"
          placeholder="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <h2>team core</h2>
        <input type="file" onChange={(e) => setTeamCore1(e.target.files[0])} />
        <input type="file" onChange={(e) => setTeamCore2(e.target.files[0])} />
        <h2>team tech</h2>
        <input type="file" onChange={(e) => setTeamTech1(e.target.files[0])} />
        <input type="file" onChange={(e) => setTeamTech2(e.target.files[0])} />
        <h2>team advisory</h2>
        <input
          type="file"
          onChange={(e) => setTeamAdvisory1(e.target.files[0])}
        />
        <input
          type="file"
          onChange={(e) => setTeamAdvisory2(e.target.files[0])}
        />
        <h2>whitepaper</h2>
        <input type="file" onChange={(e) => setWhitepaper(e.target.files[0])} />
        <h2>tokenomics</h2>
        <input type="file" onChange={(e) => setTokenomics(e.target.files[0])} />
        <h2>roadmap</h2>
        <input type="file" onChange={(e) => setRoadmap(e.target.files[0])} />
        <h2>business_model</h2>
        <input
          type="file"
          onChange={(e) => setBusinessModel(e.target.files[0])}
        />
        <h2>git</h2>
        <input type="file" onChange={(e) => setGit(e.target.files[0])} />
        <h2>mvp</h2>
        <input type="file" onChange={(e) => setMvp(e.target.files[0])} />
        <h2>cover</h2>
        <input type="file" onChange={(e) => setCover(e.target.files[0])} />
        <h2>video</h2>
        <input type="file" onChange={(e) => setVideo(e.target.files[0])} />
        {update_show ? (
          <button onClick={() => updatefct()}>update this</button>
        ) : (
          <button onClick={send}>submit</button>
        )}
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <input
        type="text"
        placeholder="search"
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={search}>search</button>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      {data &&
        data.map((d) => {
          return (
            <div>
              <Link to={`/proj/${d.id}`}>title: {d.title}</Link>
              <h2>category: {d.category}</h2>
              <h2>dev_stage: {d.dev_stage}</h2>
              {d.team.core &&
                d.team.core.map((img) => {
                  return <img src={img} width={100} alt="" />;
                })}
              <a href={d.git} download>
                download git
              </a>
              <button onClick={() => addtow(d.id)}>add to watch</button>
              <button
                onClick={() => {
                  setCurrentProjectId(d.id);
                  setUpdateShow(true);
                }}
              >
                update
              </button>
              <button onClick={() => deleteProject(d.id)}>delete</button>
              {
                final &&
                  final.watchlist.map((r) => {
                    if (r.id == d.id) {
                      return (
                        <>
                          <br />
                          <button onClick={() => removeFromWatchList(r.id)}>
                            removeFromWatchList
                          </button>
                        </>
                      );
                    }
                    // return <>
                    //   <h1>{ r.title}</h1>
                    // </>
                  })
                // <h1>{ final.watchlist.map(r=>r)}</h1>
              }
              <hr />
            </div>
          );
        })}
    </div>
  );
}

export default Test;
