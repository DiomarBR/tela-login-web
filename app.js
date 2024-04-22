const express = require("express");
const session = require('express-session');
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors()); // Adiciona o middleware CORS

const db = new sqlite3.Database("logindb.db");

app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});

// Rota para registro de usuário

app.post("/usuarios", (req, res) => {
  const { nome, email, pass } = req.body;

  // Verifica se os campos necessários estão presentes
  if (!nome || !email || !pass) {
    return res
      .status(400)
      .json({ message: "Nome, email e senha são obrigatórios" });
  }

  // Insere os dados na tabela de usuários
  db.run(
    "INSERT INTO usuario (nome, email, pass) VALUES (?, ?, ?)",
    [nome, email, pass],
    function (err) {
      if (err) {
        console.error("Erro ao inserir usuário:", err.message);
        return res
          .status(500)
          .json({ message: "Erro interno do servidor ao inserir usuário" });
      }
      console.log("Usuário inserido com sucesso, ID:", this.lastID);
      res
        .status(201)
        .json({ message: "Usuário inserido com sucesso", userID: this.lastID });
    }
  );
});

app.use(session({
  secret: 'dawdawfoefnnadpkamkdmi',
  resave: false,
  saveUninitialized: true
}));

// Rota de login
app.post("/login", (req, res) => {
  const { email, pass } = req.body;

  db.get(
    "SELECT * FROM usuario WHERE email = ? AND pass = ?",
    [email, pass],
    (err, row) => {
      if (err) {
        console.error("Erro ao buscar usuário:", err.message);
        return res.status(500).json({ message: "Erro interno do servidor" });
      }
      if (!row) {
        return res.status(401).json({ message: "Email ou senha incorretos" });
      }
      req.session.usuario = row; // Define o estado de login na sessão
      res.json({ message: "Login bem-sucedido" });
    }
  );
});
