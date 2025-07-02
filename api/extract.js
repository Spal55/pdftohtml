const formidable = require('formidable');
const fs = require('fs');
const pdfParse = require('pdf-parse');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err || !files.pdfFile) {
      return res.status(400).json({ error: 'Invalid file upload' });
    }

    const file = files.pdfFile;
    const dataBuffer = fs.readFileSync(file.filepath);

    try {
      const data = await pdfParse(dataBuffer);
      res.status(200).json({ text: data.text });
    } catch (error) {
      res.status(500).json({ error: 'Failed to parse PDF' });
    }
  });
};
