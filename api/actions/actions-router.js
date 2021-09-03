// Write your "actions" router here!
const express = require('express')
const Action = require('./actions-model')

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const actions = await Action.get()
        res.status(200).json(actions)
    } catch (err) {
        res.status(500).json({
            message: `Error retrieving the actions: ${err.message}`
        })
    }
});

router.get('/:id', (req, res) => {
    Action.get(req.params.id)
        .then(action => {
            if (!action) {
                res.status(404).json({
                    message: 'No action with that ID exists'
                })
            } else {
                res.status(200).json(action)
            }
        })
        .catch(err => {
            res.status(500).json({
                message: `Error retrieving the action with that id: ${err.message}`
            })
        })
});

router.post('/', (req, res) => {
    const { notes, description, project_id } = req.body
    if (!notes || !description || !project_id) {
        res.status(400).json({
            message: 'Please provide necessary fields for the action'
        })
    } else {
        Action.insert({ notes, description, project_id })
            .then(({ id }) => {
                return Action.get(id)
            })
            .then(action => {
                res.status(201).json(action)
            })
            .catch(err => {
                res.status(500).json({
                    message: `Error adding the action to the database: ${err.message}`
                })
            })
    }
});

router.put('/:id', (req, res) => {
    const { notes, description, project_id, completed } = req.body
    if (!notes || !description || !project_id || !completed) {
        res.status(400).json({
            message: 'Please provide necessary fields for the action'
        })
    } else {
        Action.get(req.params.id)
            .then(action => {
                if (!action) {
                    res.status(404).json({
                        message: 'No action with that ID exists'
                    })
                } else {
                    return Action.update(req.params.id, req.body)
                }
            })
            .then(action => {
                if (action) {
                    return Action.get(req.params.id)
                }
            })
            .then(action => {
                if (action) {
                    res.json(action)
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: `Error retrieving the action: ${err.message}`
                })
            })
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const action = await Action.get(req.params.id)
        if (!action) {
            res.status(404).json({
                message: 'No action with that ID exists'
            })
        } else {
            await Action.remove(req.params.id)
            res.json(action)
        }
    } catch (err) {
        res.status(500).json({
            message: `Error deleting the action: ${err.message}`
        })
    }
});

module.exports = router