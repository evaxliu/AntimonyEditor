const express = require('express');
const cors = require('cors');
const zip = require('adm-zip');

const app = express();
const port = 3001;
app.use(cors());

app.get('/download', async (req, res) => {
  const modelId = req.query.models;
  const apiUrl = `https://www.ebi.ac.uk/biomodels/search/download?models=${modelId}`;

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error('Failed to fetch the model from BioModels');
    }

    const respBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(respBuffer);
    const zipFile = new zip(buffer);
    const sbmlEntry = zipFile.getEntries()[0];

    if (!sbmlEntry) {
      throw new Error('No SBML file found in the ZIP archive');
    }

    const sbmlContent = sbmlEntry.getData().toString('utf-8');
    
    res.send(sbmlContent);
  } catch (error) {
    console.error('Error: An error occurred while fetching data', error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
