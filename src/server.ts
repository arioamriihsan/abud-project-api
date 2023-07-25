import errorHandler from "errorhandler";
import app from "./app";

/**
 * Error Handler. Provides full stack
 */
if (process.env.NODE_ENV === "development") {
  app.use(errorHandler());
}

/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
  console.log(
    "\x1b[36m%s\x1b[0m",
    `  App is running at http://localhost:${app.get("port")} in ${app.get(
      "env"
    )} mode`
  );
  console.log("\x1b[33m%s\x1b[0m", "  Press CTRL-C to stop\n");
});

export default server;
