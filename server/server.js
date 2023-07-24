const cors = require('cors');
const cookieParser = require('cookie-parser')
const express = require('express');
const app = express();
const port = process.env.SERVER_PORT || 8080;
const knex = require('knex')(require('./knexfile.js')['development'])

app.use(cors())
app.use(cookieParser())
app.use(express.json())

app.listen(port, ()=> {console.log(`Server listening on port ${port}`)})

app.get('/', (req, res) =>{
    res.status(200).json({message: 'Server running.'})
    console.log(`GET /`)
})

app.get('/spark_list', (req, res) =>{
    knex.select('*')
        .from('cell')
        .join('base', 'cell.base_id', 'base.id')
        .then(data => res.status(200).json(data))
        .then(console.log(`GET /spark_list`))
        .catch(err => { res.status(500).json({message: err})
                        console.log(`GET /spark_list ERROR: ${err}`)})
})

app.get('/news', (req, res) =>{
    knex.select('*')
        .from('news_feed')
        .orderBy('date', 'desc')
        .then(data => res.status(200).json(data))
        .then(console.log(`GET /news`))
        .catch(err => { res.status(500).json({message: err})
                        console.log(`GET /news ERROR: ${err}`)})
})

app.get('/cell/:cellId', (req, res) =>{
    knex.select('*')
        .from('cell')
        .where('id', req.params.cellId)
        .then(data => res.status(200).json(data))
        .then(console.log(`GET /cell/${req.params.cellId}`))
        .catch(err => { res.status(500).json({message: err})
                        console.log(`GET /cell/${req.params.cellId} ERROR: ${err}`)})
})

app.get('/cell/:cellId/team', (req, res) =>{
    knex.select('*')
        .from('users')
        .where('cell_id', req.params.cellId)
        .then(data => res.status(200).json(data))
        .then(console.log(`GET /cell/${req.params.cellId}/team`))
        .catch(err => { res.status(500).json({message: err})
                        console.log(`GET /cell/${req.params.cellId}/team ERROR: ${err}`)})
})

app.get('/cell/:cellId/proposed_projects', (req, res) =>{
    knex.select('*')
        .from('project')
        .where('cell_id', req.params.cellId)
        .andWhere('is_approved', false)
        .then(data => res.status(200).json(data))
        .then(console.log(`GET /cell/${req.params.cellId}/proposed_projects`))
        .catch(err => { res.status(500).json({message: err})
                        console.log(`GET /cell/${req.params.cellId}/proposed_projects ERROR: ${err}`)})
})

app.get('/cell/:cellId/current_projects', (req, res) =>{
    knex.select('*')
        .from('project')
        .where('cell_id', req.params.cellId)
        .andWhere('is_approved', true)
        .andWhere('is_complete', false)
        .then(data => res.status(200).json(data))
        .then(console.log(`GET /cell/${req.params.cellId}/current_projects`))
        .catch(err => { res.status(500).json({message: err})
                        console.log(`GET /cell/${req.params.cellId}/current_projects ERROR: ${err}`)})
})

app.get('/cell/:cellId/previous_projects', (req, res) =>{
    knex.select('*')
        .from('project')
        .where('cell_id', req.params.cellId)
        .andWhere('is_approved', true)
        .andWhere('is_complete', true)
        .then(data => res.status(200).json(data))
        .then(console.log(`GET /cell/${req.params.cellId}/previous_projects`))
        .catch(err => { res.status(500).json({message: err})
                        console.log(`GET /cell/${req.params.cellId}/previous_projects ERROR: ${err}`)})
})

app.get('/project/:projectId', (req, res) =>{
    knex.select('*')
        .from('project')
        .where('id', req.params.projectId)
        .then(data => res.status(200).json(data))
        .then(console.log(`GET /project/${req.params.projectId}`))
        .catch(err => { res.status(500).json({message: err})
                        console.log(`GET /project/${req.params.projectId} ERROR: ${err}`)})
})

app.get('/project/:projectId/team', (req, res) =>{
    knex.select('users.*')
        .from('project')
        .join('project_users', 'project.id', 'project_users.project_id')
        .join('users', 'users.id', 'project_users.project_id')
        .where('project.id', req.params.projectId)
        .then(data => res.status(200).json(data))
        .then(console.log(`GET /project/${req.params.projectId}/team`))
        .catch(err => { res.status(500).json({message: err})
                        console.log(`GET /project/${req.params.projectId}/team ERROR: ${err}`)})
})

app.get('/project/:projectId/tags', (req, res) =>{
    knex.select('tag.*')
        .from('project')
        .join('project_tag', 'project.id', 'project_tag.project_id')
        .join('tag', 'tag.id', 'project_tag.tag_id')
        .where('project.id', req.params.projectId)
        .then(data => res.status(200).json(data))
        .then(console.log(`GET /project/${req.params.projectId}/tags`))
        .catch(err => { res.status(500).json({message: err})
                        console.log(`GET /project/${req.params.projectId}/tags ERROR: ${err}`)})
})

app.get('/project/:projectId/photos', (req, res) =>{
    knex.select('*')
        .from('project_photo')
        .where('project_id', req.params.projectId)
        .then(data => res.status(200).json(data))
        .then(console.log(`GET /project/${req.params.projectId}/photos`))
        .catch(err => { res.status(500).json({message: err})
                        console.log(`GET /project/${req.params.projectId}/photos ERROR: ${err}`)})
})