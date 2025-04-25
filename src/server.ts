import app from "./app";
import { connect_database } from "./config/mongodb";
import { ENV } from "./config/env";

connect_database();

app.listen(ENV.PORT, () => {
  console.log("Server is running on port 3000");
});
