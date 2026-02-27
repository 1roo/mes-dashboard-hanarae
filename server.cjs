const jsonServer = require("json-server");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post("/auth/login", (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: "username/password required" });
  }

  const users = router.db.get("users").value() || [];
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (!user) return res.status(401).json(null);

  const { password: _pw, ...safeUser } = user;
  return res.json(safeUser);
});

server.use(router);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`JSON Server running at http://localhost:${PORT}`);
});
