// Write your "projects" router here!
const express = require('express')
const Project = require('./projects-model')

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

router.get('/:id', (req, res) => {
    Project.get(req.params.id)
        .then(project => {
            if (!project) {
                res.status(404).json({
                    message: 'No project with that id exists'
                })
            } else {
                res.status(200).json(project)
            }
        })
        .catch(err => {
            res.status(500).json({
                message: `There was a problem retrieving the project: ${err.message}`
            })
        })
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

});

router.delete('/:id', (req, res) => {

});

router.get('/:id/actions', (req, res) => {

});

module.exports = router