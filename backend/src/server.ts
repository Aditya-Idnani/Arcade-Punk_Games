import { app } from "./app";
import { config } from "./config";

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Arcade Games API running on http://localhost:${config.port}`);
});
