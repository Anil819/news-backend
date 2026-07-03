import genAI from "../config/gemini.js";

export const generateDescription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    console.log("Image:", req.file.path);

    const response = await fetch(req.file.path);
    const buffer = Buffer.from(await response.arrayBuffer());

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent([
      "Describe this image in exactly 20 words.",
      {
        inlineData: {
          data: buffer.toString("base64"),
          mimeType: req.file.mimetype,
        },
      },
      
    ]);

    const description = result.response.text();

    res.json({
      description,
    });

  } catch (err) {
  console.log("========== GEMINI ERROR ==========");
  console.log(err);
  console.log("Message:", err.message);

  if (err.response) {
    console.log("Response:", err.response.data);
  }

  res.status(500).json({
    message: "AI Error",
    error: err.message,
  });
}
}