import fastify from "fastify";
import { Routes } from "./http/controllers/routes";
import multipart from "@fastify/multipart";

export const app = fastify();
app.register(multipart);

app.register(Routes);
