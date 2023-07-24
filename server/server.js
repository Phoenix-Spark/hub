import cors from "cors";
import cookieParser from "cookie-parser";
import express, { json } from "express";
import knex from "knex";
import { development } from "./knexfile.js";
const knexInstance = knex(development);
const app = express();
const port = process.env.SERVER_PORT || 8080;

app.use(cors());
app.use(cookieParser());
app.use(json());

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server running." });
  console.log(`GET /`);
});

app.get("/spark_list", (req, res) => {
  knexInstance
    .select("*")
    .from("cell")
    .join("base", "cell.base_id", "base.id")
    .then((data) => res.status(200).json(data))
    .then(console.log(`GET /spark_list`))
    .catch((err) => {
      res.status(500).json({ message: err });
      console.log(`GET /spark_list ERROR: ${err}`);
    });
});

app.get("/news", (req, res) => {
  knexInstance
    .select("*")
    .from("news_feed")
    .orderBy("date", "desc")
    .then((data) => res.status(200).json(data))
    .then(console.log(`GET /news`))
    .catch((err) => {
      res.status(500).json({ message: err });
      console.log(`GET /news ERROR: ${err}`);
    });
});

app.get("/cell/:cellId", (req, res) => {
  knexInstance
    .select("*")
    .from("cell")
    .where("id", req.params.cellId)
    .then((data) => res.status(200).json(data))
    .then(console.log(`GET /cell/${req.params.cellId}`))
    .catch((err) => {
      res.status(500).json({ message: err });
      console.log(`GET /cell/${req.params.cellId} ERROR: ${err}`);
    });
});

app.get("/cell/:cellId/team", (req, res) => {
  knexInstance
    .select("*")
    .from("users")
    .where("cell_id", req.params.cellId)
    .then((data) => res.status(200).json(data))
    .then(console.log(`GET /cell/${req.params.cellId}/team`))
    .catch((err) => {
      res.status(500).json({ message: err });
      console.log(`GET /cell/${req.params.cellId}/team ERROR: ${err}`);
    });
});

app.get("/cell/:cellId/proposed_projects", (req, res) => {
  knexInstance
    .select("*")
    .from("project")
    .where("cell_id", req.params.cellId)
    .andWhere("is_approved", false)
    .then((data) => res.status(200).json(data))
    .then(console.log(`GET /cell/${req.params.cellId}/proposed_projects`))
    .catch((err) => {
      res.status(500).json({ message: err });
      console.log(
        `GET /cell/${req.params.cellId}/proposed_projects ERROR: ${err}`
      );
    });
});

app.get("/cell/:cellId/current_projects", (req, res) => {
  knexInstance
    .select("*")
    .from("project")
    .where("cell_id", req.params.cellId)
    .andWhere("is_approved", true)
    .andWhere("is_complete", false)
    .then((data) => res.status(200).json(data))
    .then(console.log(`GET /cell/${req.params.cellId}/current_projects`))
    .catch((err) => {
      res.status(500).json({ message: err });
      console.log(
        `GET /cell/${req.params.cellId}/current_projects ERROR: ${err}`
      );
    });
});

app.get("/cell/:cellId/previous_projects", (req, res) => {
  knexInstance
    .select("*")
    .from("project")
    .where("cell_id", req.params.cellId)
    .andWhere("is_approved", true)
    .andWhere("is_complete", true)
    .then((data) => res.status(200).json(data))
    .then(console.log(`GET /cell/${req.params.cellId}/previous_projects`))
    .catch((err) => {
      res.status(500).json({ message: err });
      console.log(
        `GET /cell/${req.params.cellId}/previous_projects ERROR: ${err}`
      );
    });
});

app.get("/project/:projectId", (req, res) => {
  knexInstance
    .select("*")
    .from("project")
    .where("id", req.params.projectId)
    .then((data) => res.status(200).json(data))
    .then(console.log(`GET /project/${req.params.projectId}`))
    .catch((err) => {
      res.status(500).json({ message: err });
      console.log(`GET /project/${req.params.projectId} ERROR: ${err}`);
    });
});

app.get("/project/:projectId/team", (req, res) => {
  knexInstance
    .select("users.*")
    .from("project")
    .join("project_users", "project.id", "project_users.project_id")
    .join("users", "users.id", "project_users.project_id")
    .where("project.id", req.params.projectId)
    .then((data) => res.status(200).json(data))
    .then(console.log(`GET /project/${req.params.projectId}/team`))
    .catch((err) => {
      res.status(500).json({ message: err });
      console.log(`GET /project/${req.params.projectId}/team ERROR: ${err}`);
    });
});

app.get("/project/:projectId/tags", (req, res) => {
  knexInstance
    .select("tag.*")
    .from("project")
    .join("project_tag", "project.id", "project_tag.project_id")
    .join("tag", "tag.id", "project_tag.tag_id")
    .where("project.id", req.params.projectId)
    .then((data) => res.status(200).json(data))
    .then(console.log(`GET /project/${req.params.projectId}/tags`))
    .catch((err) => {
      res.status(500).json({ message: err });
      console.log(`GET /project/${req.params.projectId}/tags ERROR: ${err}`);
    });
});

app.get("/project/:projectId/photos", (req, res) => {
  knexInstance
    .select("*")
    .from("project_photo")
    .where("project_id", req.params.projectId)
    .then((data) => res.status(200).json(data))
    .then(console.log(`GET /project/${req.params.projectId}/photos`))
    .catch((err) => {
      res.status(500).json({ message: err });
      console.log(`GET /project/${req.params.projectId}/photos ERROR: ${err}`);
    });
});
