// Write your "projects" router here!
const express = require('express')
const Project = require('./projects-model')
const {
    validateProjectId
} = require('./projects-middleware')
const router = express.Router()

router.get('/', async (req, res) => {
    try{
        const projects = await Project.get(req.params.id)
        res.status(200).json(projects)
    } catch (err) {
        res.status(500).json({
            message: `There was a problem retrieving the Projects: ${err.message}`
        })
    }
});

router.get('/:id', validateProjectId, (req, res) => {
    res.json(req.params.id)
});

router.post('/', (req, res) => {
    const { name, description, completed } = req.body
    if (!name || !description || !completed) {
        res.status(400).json({
            message: 'Please provide a name and description for the project'
        })
    } else {
        Project.insert({ name, description, completed })
            .then(({ id }) => {
                return Project.get(id)
            })
            .then(project => {
                res.status(201).json(project)
            })
            .catch(err => {
                res.status(500).json({
                    message: 'There was an error adding the project to the database',
                    err: err.message
                })
            })
    }
});

router.put('/:id', (req, res) => {
    const { name, description, completed } = req.body
    if (!name || !description || completed ==null) {
        res.status(400).json({
            message: 'Please provide updates to the project fields'
        })
    } else {
        Project.get(req.params.id)
            .then(project => {
                if (!project) {
                    res.status(404).json({
                        message: 'The project with specified ID does not exist'
                    })
                } else {
                    return Project.update(req.params.id, req.body)
                }
            })
            .then(data => {
                if (data) {
                    return Project.get(req.params.id)
                }
            })
            .then(project => {
                if (project) {
                    res.json(project)
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: `Error fetching the project: ${err.message}`
                })
            })
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const project = await Project.get(req.params.id)
        if (!project) {
            res.status(404).json({
                message: 'The project with the specified ID does not exist',
            })
        } else {
            await Project.remove(req.params.id)
            res.json(project)
        }
    } catch (err) {
        res.status(500).json({
            message: 'The project could not be removed',
            err: err.message
        })
    }
});

router.get('/:id/actions', async (req, res) => {
    try {
        const project = await Project.get(req.params.id)
        if (!project) {
            res.status(404).json({
                message: 'The project with the specified ID does not exist'
            })
        } else {
            const actions = await Project.getProjectActions(req.params.id)
            res.json(actions)
        }
    } catch (err) {
        res.status(500).json({
            message: 'The actions could not be retrieved',
            err: err.message
        })
    }
});

module.exports = router