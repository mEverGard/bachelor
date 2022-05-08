const Sentry = require("@sentry/node");
const express = require("express");

// https://docs.sentry.io/platforms/node/guides/express/

// or using CommonJS
// const express = require('express');
// const Sentry = require('@sentry/node');

const app = express();

Sentry.init({
  dsn: "https://xxx@xxx.ingest.sentry.io/xxx",
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// All controllers should live here
app.get("/", function rootHandler(req, res) {});

app.get("/error", function mainHandler(req, res) {
  try {
    throw new Error("Important Function failed");
  } catch (e) {
    Sentry.captureException(e, (scope) => {
      scope.clear();
      scope.setUser({ email: "alex@kreissl.at", id: "1234" });
      scope.setTag("PermissionLevel", "admin");
      scope.setContext("UserContext", { "Last Login": "1649666667" });
      return scope;
    });
    console.log("hey");
    res.end("Error happened");
    return;
  }
  res.end("Hi!");
  return;
});

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.listen(3000, () => {
  console.log(`Example app listening on port 3000`);
});
