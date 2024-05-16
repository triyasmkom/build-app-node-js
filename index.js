const express = require('express');
const fs = require('fs');
const app = express();
const config = require('./app.config.json');
const port = config.port || 10000;

app.use(express.json());

const filePath = './file.json';

// Fungsi untuk membaca file JSON
function readJsonFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(e);
        }
      }
    });
  });
}


// Fungsi untuk menulis ke file JSON
function writeJsonFile(filePath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// Endpoint untuk mendapatkan semua data
app.get('/data', async (req, res) => {
  try {
    const data = await readJsonFile(filePath);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Could not read file' });
  }
});

// Endpoint untuk menambahkan data baru
app.post('/data', async (req, res) => {
  try {
    const newData = req.body;
    const data = await readJsonFile(filePath);
    data.push(newData);
    await writeJsonFile(filePath, data);
    res.status(201).json(newData);
  } catch (err) {
    res.status(500).json({ error: 'Could not write to file' });
  }
});

// Endpoint untuk memperbarui data
app.put('/data/:model', async (req, res) => {
  try {
    const model = req.params.model;
    const updatedData = req.body;
    const data = await readJsonFile(filePath);
    const index = data.findIndex(item => item.model === model);
    if (index !== -1) {
      data[index] = updatedData;
      await writeJsonFile(filePath, data);
      res.json(updatedData);
    } else {
      res.status(404).json({ error: 'Data not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Could not write to file' });
  }
});

// Endpoint untuk menghapus data
app.delete('/data/:model', async (req, res) => {
  try {
    const model = req.params.model;
    const data = await readJsonFile(filePath);
    const index = data.findIndex(item => item.model === model);
    if (index !== -1) {
      const deletedData = data.splice(index, 1);
      await writeJsonFile(filePath, data);
      res.json(deletedData);
    } else {
      res.status(404).json({ error: 'Data not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Could not write to file' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
