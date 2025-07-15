import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";
import "dotenv/config";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(".")); // Servește fișierele HTML, CSS, JS

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/recomanda", async (req, res) => {
  const {
    formaFetei, genul, stilul,
    latimeFata, inaltimeFata, distOchi,
    latimeBarbie, raport, interpupilara,
    latimeNas, inaltimeFrunte, latimeSprancene,
  } = req.body;

  const prompt = `
Ești un consultant de stil specializat în alegerea ramelor de ochelari pe baza trăsăturilor faciale ale unei persoane.

Clientul are următorul profil:
- Formă față: ${formaFetei}
- Gen: ${genul}
- Stil preferat: ${stilul}

Măsurători faciale:
- Lățime față: ${latimeFata}
- Înălțime față: ${inaltimeFata}
- Raport lățime/înălțime: ${raport}
- Lățime bărbie: ${latimeBarbie}
- Distanță între ochi: ${distOchi}
- Distanță interpupilară: ${interpupilara}
- Lățime nas: ${latimeNas}
- Înălțime frunte: ${inaltimeFrunte}
- Lățime sprâncene: ${latimeSprancene}

Pe baza acestor informații, oferă o recomandare clară și concisă (3-5 fraze) pentru tipul de rame de ochelari potrivite, explicând alegerea într-un mod profesionist, dar ușor de înțeles. Ține cont atât de proporții, cât și de preferința de stil și genul clientului.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // sau gpt-3.5-turbo dacă nu ai plan plătit
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const mesaj = completion.choices?.[0]?.message?.content || "Nu s-a primit un răspuns.";
    res.json({ raspuns: mesaj });
  } catch (error) {
    console.error("Eroare GPT:", error.response?.data || error.message);
    res.status(500).json({ raspuns: "Eroare: nu s-a primit un răspuns valid." });
  }
});

// PORNEȘTE SERVERUL
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
