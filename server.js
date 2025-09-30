require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { OpenAI } = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Rota principal que envia o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Configuração da OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Rota de análise infantil
app.post('/analisar', async (req, res) => {
  const { nome, idade, descricao } = req.body;

  const prompt = `Criança: ${nome}, Idade: ${idade} anos.\nDescrição: ${descricao}\n\nClassifique o perfil da criança e sugira atividades de desenvolvimento individualizadas.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500
    });

    const resposta = completion.choices[0].message.content;
    res.json({ resposta });
  } catch (error) {
    console.error('Erro ao chamar a API:', error.message);
    res.status(500).json({
      resposta: 'Erro ao processar a análise. Verifique a chave da API ou tente novamente.'
    });
  }
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
