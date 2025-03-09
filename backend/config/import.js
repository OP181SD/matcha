import Fastify from 'fastify';
import fastifyPostgres from '@fastify/postgres';
import dotenv from 'dotenv';
import bycrypt from 'bcrypt';

dotenv.config()

export const fastify = Fastify ({
    logger: true
})

export const byCryptHash = bycrypt.hash;
export const byCryptCompare = bycrypt.compare;
fastify.register(fastifyPostgres, {
    connectionString: process.env.DATABASE_URL
    
});
