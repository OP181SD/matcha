import Fastify from 'fastify';
import fastifyPostgres from '@fastify/postgres';
import dotenv from 'dotenv';
import bycrypt from 'bcrypt';
import fastifyJwt from '@fastify/jwt';
import jwt from 'jsonwebtoken';

dotenv.config()

export const fastify = Fastify ({
    logger: true
})

export const byCryptHash = bycrypt.hash;
export const byCryptCompare = bycrypt.compare;

export const generateToken = jwt.sign;
export const verifyToken = jwt.verify;


fastify.register(fastifyPostgres, {
    connectionString: process.env.DATABASE_URL
});

fastify.register(fastifyJwt, {
    secret: 'my_secret_key',
    cookie: {
      cookieName: 'accces_token',
      signed: false,
    },
  });

export const SECRET_KEY = 'MATCHACRPYT';
export const API_URL = 'http://127.0.0.1:5001';