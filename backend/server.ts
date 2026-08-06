import app from "./src/app.js";
const port = process.env.LINKED_PORT || 3000;
app.listen(port, () => {
  console.log("server is running and do a health check if needed");
});
