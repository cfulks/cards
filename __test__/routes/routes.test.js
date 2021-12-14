import request from "supertest";
import express from "express";
import routes from "../../src/routes/routes.js";
import { beforeAll, expect } from "@jest/globals";

import fs from "fs";
import path from "path";

describe("GET Endpoint", () => {
  const html = {};
  let app;

  beforeAll(() => {
    app = routes(express());

    let filePaths = {
      blackjack: path.join(
        __dirname,
        "..",
        "..",
        "src",
        "views",
        "html",
        "blackjack.html"
      ),
      join: path.join(
        __dirname,
        "..",
        "..",
        "src",
        "views",
        "html",
        "join.html"
      ),
      error: path.join(
        __dirname,
        "..",
        "..",
        "src",
        "views",
        "html",
        "error.html"
      ),
      home: path.join(
        __dirname,
        "..",
        "..",
        "src",
        "views",
        "html",
        "index.html"
      ),
      solitaire: path.join(
        __dirname,
        "..",
        "..",
        "src",
        "views",
        "html",
        "solitaire.html"
      ),
    };

    for (let files in filePaths) {
      html[files] = fs.readFileSync(
        filePaths[files],
        "utf8",
        (err, data) => data
      );
    }
  });

  it("should return home page", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe(html.home);
  });

  it("should return solitaire page", async () => {
    const res = await request(app).get("/solitaire");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe(html.solitaire);
  });

  it("should return blackjack page", async () => {
    const res = await request(app).get("/blackjack/0");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe(html.blackjack);
  });

  it("should return join page", async () => {
    const res = await request(app).get("/blackjack");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe(html.join);
  });

  it("should return error page", async () => {
    const res = await request(app).get("/random-useless-page");
    expect(res.statusCode).toEqual(404);
    expect(res.text).toBe(html.error);
  });
});
