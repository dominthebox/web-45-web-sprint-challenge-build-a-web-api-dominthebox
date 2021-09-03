// add middlewares here related to projects
const Project = require('./projects-model')

async function validateProjectId(req, res, next) {
    try {
        const project = await Project.get(req.params.id)
        if (!project) {
            res.status(404).json({
                message: 'No project with that id exists'
            })
        } else {
            res.status(200).json(project)
            next()
        }
    } catch (err) {
        res.status(500).json({
            message: `There was a problem retrieving the project: ${err.message}`
        })
    }
}

module.exports = {
    validateProjectId
}