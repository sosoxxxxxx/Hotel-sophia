import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ➤ Rota de teste
app.get("/", (req, res) => {
  res.send("Servidor do Hotel Sophia está funcionando! 🏨");
});

// ➤ Rota de cadastro
app.post("/cadastro", async (req, res) => {
  const { nome, email, senha } = req.body;
  const { error } = await supabase.from("usuarios").insert([{ nome, email, senha }]);
  if (error) return res.status(400).json({ erro: error.message });
  res.json({ sucesso: true });
});

// ➤ Rota de login
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("email", email)
    .eq("senha", senha)
    .single();

  if (error || !data) return res.status(401).json({ erro: "Credenciais inválidas" });
  res.json({ sucesso: true, usuario: data });
});

// ➤ Inicia o servidor
app.listen(process.env.PORT || 3001, () => {
  console.log("🚀 Servidor rodando na porta 3001");
});
