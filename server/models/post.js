'use strict';
const Joi = require('joi');
const MongoModels = require('mongo-models');
const Slug = require('slug');


class Posts extends MongoModels {
    static create(name, content, callback) {

        const document = {
            name: name,
            content: content,
            isActive: true,
            date: new Date()
        };

        this.insertOne(document, (err, docs) => {

            if (err) {
                return callback(err);
            }

            callback(null, docs[0]);
        });
    }

}


Posts.collection = 'posts';


// Posts._idClass = String;


Posts.schema = Joi.object().keys({
    _id: Joi.string(),
    name: Joi.string(),
    content: Joi.string(),
    isActive: Joi.boolean().default(true),
    date: Joi.date()
});


module.exports = Posts;