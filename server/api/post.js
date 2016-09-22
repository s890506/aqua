'use strict';
const Async = require('async');
const Boom = require('boom');
const Joi = require('joi');


const internals = {};

internals.applyRoutes = function (server, next) {

    const Posts = server.plugins['hapi-mongo-models'].Posts;

    server.route({
        method: 'GET',
        path: '/hello',
        handler: function (request, reply) {

            reply({ message: 'Hello World!' });

        }
    });

    server.route({
        method: 'GET',
        path: '/post',
        handler: function (request, reply) {

            Posts.find((err, posts) => {

                if (err) {
                    return reply(err);
                }

                if (!posts) {
                    return reply(Boom.notFound('No any document.'));
                }

                reply(posts);
            });

        }
    });

    server.route({
        method: 'GET',
        path: '/post/{name}',
        handler: function (request, reply) {

            const conditions = {
                name: request.params.name
            };

            Posts.findOne(conditions, (err, post) => {

                if (err) {
                    return reply(err);
                }

                if (!post) {
                    return reply(Boom.notFound('Document not found.'));
                }

                reply(post);
            });

        }
    });

    server.route({
        method: 'POST',
        path: '/post',
        config: {
            validate: {
                payload: {
                    name: Joi.string().required(),
                    content: Joi.string().required()
                }
            }
        },
        handler: function (request, reply) {

            Async.auto({
                user: function (done) {

                    const name = request.payload.name;
                    const content = request.payload.content;

                    Posts.create(name, content, done);
            }}, (err, results) => {

                if (err) {
                    return reply(err);
                }

                reply(results);
            });

        }
    });

    server.route({
        method: 'PUT',
        path: '/post/{name}',
        config: {
            validate: {
                payload: {
                    name: Joi.string().required(),
                    content: Joi.string().required()
                }
            }
        },
        handler: function (request, reply) {

            const conditions = {
                name: request.params.name
            };

            const update = {
                $set: {
                    name: request.payload.name,
                    content: request.payload.content
                }
            };

            Posts.findOneAndUpdate(conditions, update, (err, post) => {

                if (err) {
                    return reply(err);
                }

                if (!post) {
                    return reply(Boom.notFound('Document not found.'));
                }

                reply(post);
            });

        }
    });

    server.route({
        method: 'DELETE',
        path: '/post/{name}',
        handler: function (request, reply) {

            const conditions = {
                name: request.params.name
            };

            Posts.findOneAndDelete(conditions, (err, post) => {

                if (err) {
                    return reply(err);
                }

                if (!post) {
                    return reply(Boom.notFound('Document not found.'));
                }

                reply(post);
            });

        }
    });


    next();
};

exports.register = function (server, options, next) {

    server.dependency(['hapi-mongo-models'], internals.applyRoutes);

    next();
};


exports.register.attributes = {
    name: 'post'
};
