const Sentry = require("@sentry/node");
const express = require("express");
const request = require("request");

// https://docs.sentry.io/platforms/node/guides/express/

// or using CommonJS
// const express = require('express');
// const Sentry = require('@sentry/node');

const app = express();

Sentry.init({
  dsn: "project_url",
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// All controllers should live here
app.get("/", function rootHandler(req, res) {});

app.get("/feedback", function (req, res) {
  res.sendFile("index.html");
});

app.get("/error", function mainHandler(req, res) {
  var eventid;
  try {
    throw new Error("Important Function failed");
  } catch (e) {
    event_id = Sentry.captureException(e, (scope) => {
      scope.clear();
      scope.setUser({ email: "alex@kreissl.at", id: "1234" });
      scope.setTag("PermissionLevel", "admin");
      scope.setContext("UserContext", { "Last Login": "1649666667" });
      return scope;
    });
  }
  request.post(
    "https://sentry.io/api/0/projects/{organization_slug}/{project_slug}/user-feedback/ ",
    {
      auth: {
        bearer: "Token",
      },
      form: {
        event_id: event_id,
        name: "Alex K.",
        email: "no-reply@no-reply.at",
        comments: "Clicked a button and it broke!",
      },
    }
  );
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
