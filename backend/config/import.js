import Fastify from "fastify";
import dotenv  from "dotenv";
import pg      from "pg";
import bycrypt from "bcrypt";


dotenv.config();

export const fastify = Fastify({ logger: true });
export const PORT = 5001;
export const { Pool } = pg;
export const bcryptHash = bycrypt.hash;
export const bycryptCompare = bycrypt.compare;

