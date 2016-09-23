'use strict';
const Async = require('async');
const Boom = require('boom');
const Joi = require('joi');
const keywordExtractor = require('keyword-extractor');
const fs = require('fs');


const internals = {};

internals.applyRoutes = function (server, next) {

    server.route({
        method: 'POST',
        path: '/extractor',
        config: {
            validate: {
                payload: {
                    input: Joi.string().required()
                }
            }
        },
        handler: function (request, reply) {

            const input = request.payload.input;

            //  Extract the keywords
            const extractionResult = keywordExtractor.extract(input, {
                                                                language:"english",
                                                                remove_digits: true,
                                                                return_changed_case:true,
                                                                remove_duplicates: false
                                                           });

            reply({ output: extractionResult });

        }
    });

    server.route({
        method: 'POST',
        path: '/upload',
        config: {

            payload: {
                maxBytes:209715200,
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data'
            },

            handler: function (request, reply) {
                const data = request.payload;
                if (data.file) {

                    let name = data.file.hapi.filename;

                    // 取得副檔名
                    const ext = (name.substr(name.lastIndexOf('.') + 1)).toLowerCase();                    

                    if (ext == 'mp3' || ext == 'wav' || ext == 'flac') {
                        name = Math.random().toString(36).substr(2) + '.' + ext;

                        const path = __dirname + "/../../public/uploads/" + name;
                        const file = fs.createWriteStream(path);

                        file.on('error', function (err) { 
                            console.error(err) 
                        });

                        data.file.pipe(file);

                        data.file.on('end', function (err) { 
                            const ret = {
                                filename: name,
                                headers: data.file.hapi.headers
                            }
                            reply(JSON.stringify(ret));
                        });
                    } else
                        return reply(Boom.notFound('file format error.'));                   

                    
                }//end if data

            }// end handler
        }
    });


    next();
};

exports.register = function (server, options, next) {

    server.dependency(['hapi-mongo-models'], internals.applyRoutes);

    next();
};


exports.register.attributes = {
    name: 'extractor'
};
