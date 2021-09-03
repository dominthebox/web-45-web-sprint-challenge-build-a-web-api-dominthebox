// add middlewares here related to actions
const Action = require('./actions-model')

async function validateActionId(req, res, next) {
    try {
        const action = await Action.get(req.params.id)
        if (!action) {
            res.status(404).json({
                message: 'No action with that ID exists'
            })
        } else {
            res.status(200).json(action)
            next()
        }
    } catch (err) {
        res.status(500).json({
            message: `Error retrieving the action with that id: ${err.message}`
        })
    }
}

module.exports = {
    validateActionId
}