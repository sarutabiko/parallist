const Joi = require('joi');

const NodeSchema = Joi.object({
    data: Joi.string().required(),
    topic: Joi.string().required(),
}).required();

module.exports = { NodeSchema };