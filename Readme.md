# Build Rest API to Windows or Linux or Mac Os

Untuk membangun REST API menggunakan Node.js, Anda dapat menggunakan framework seperti Express.js karena kesederhanaannya dan kemampuannya dalam mengelola rute dan middleware. Berikut ini adalah langkah-langkah untuk membuat REST API dasar yang membaca, menulis, memperbarui, dan menghapus data dari sebuah file JSON:

1. Setup Proyek: Membuat proyek Node.js dan menginstal dependensi yang diperlukan.
2. Membuat Endpoint REST API: Mengimplementasikan endpoint untuk operasi CRUD (Create, Read, Update, Delete).
3. Membaca dan Menulis File JSON: Mengelola data dalam file JSON.

## Langkah 1: Setup Proyek

1. Buat direktori proyek baru dan inisialisasi npm:

    ```bash
    mkdir rest-api
    cd rest-api
    npm init -y
    ```

2. Instal Express.js dan nodemon (untuk pengembangan):

    ```bash
    npm install express
    npm install --save-dev nodemon
    ```

3. Tambahkan script start di package.json untuk menjalankan server dengan nodemon:

    ```json
    "scripts": {
    "start": "nodemon index.js"
    }

    ```
## Langkah 2: Membuat Server dengan Express.js

Buat file index.js di direktori proyek Anda dan tambahkan kode berikut:

```js
const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

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

```

## Langkah 3: Membuat File JSON Contoh

```json
[
  {
    "model": "ABC",
    "description": "Model GZ",
    "cycleTime": 120,
    "setting": 200
  },
  {
    "model": "DEF",
    "description": "Model DEF",
    "cycleTime": 240,
    "setting": 200
  },
  {
    "model": "XYZ",
    "description": "Model XYZ",
    "cycleTime": 180,
    "setting": 250
  }
]
```

## Menjalankan Server

Jalankan server dengan perintah berikut:

```bash
npm start
```

Server akan berjalan di http://localhost:3000. Anda dapat menggunakan tools seperti Postman atau cURL untuk menguji endpoint-endpoint yang telah dibuat.

## Menguji Endpoint

1. GET /data: Mendapatkan semua data.

    ```bash
    curl http://localhost:3000/data
    ```

2. POST /data: Menambahkan data baru

    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"model": "XYZ", "description": "Model XYZ", "cycleTime": 180, "setting": 250}' http://localhost:3000/data
    ```

3. PUT /data/:model: Memperbarui data yang sudah ada.

    ```bash
    curl -X PUT -H "Content-Type: application/json" -d '{"model": "GZ", "description": "Updated Model GZ", "cycleTime": 130, "setting": 210}' http://localhost:3000/data/GZ
    ```

4. DELETE /data/:model: Menghapus data.

    ```bash
    curl -X DELETE http://localhost:3000/data/GZ
    ```

Dengan langkah-langkah di atas, Anda telah berhasil membuat REST API sederhana menggunakan Node.js dan Express.js yang dapat membaca, menulis, memperbarui, dan menghapus data dari sebuah file JSON.

## Cara build menjadi exe

Untuk mengubah aplikasi Node.js menjadi file executable (.exe), Anda dapat menggunakan paket seperti pkg. pkg mengemas aplikasi Node.js beserta semua dependensinya menjadi satu file executable yang dapat dijalankan di Windows (serta MacOS dan Linux jika diperlukan).

Berikut adalah langkah-langkah untuk membuild aplikasi Node.js menjadi file executable menggunakan pkg:

### Langkah 1: Instal `pkg`

Pertama, instal pkg secara global di sistem Anda menggunakan npm:

```bash
npm install -g pkg
```

### Langkah 2: Menyiapkan Proyek

Pastikan Anda sudah memiliki aplikasi Node.js yang lengkap. Untuk contoh ini, pastikan file `index.js` dan `file.json` ada di direktori proyek Anda.

### Langkah 3: Menambahkan Konfigurasi `pkg` ke `package.json`

Tambahkan konfigurasi `pkg` ke file `package.json` untuk menentukan file entry point aplikasi Anda dan aset apa saja yang perlu diikutsertakan. Misalnya:

```json
{
  "name": "rest-api",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "nodemon index.js"
  },
  "pkg": {
    "scripts": "index.js",
    "assets": [
      "file.json"
    ]
  },
  "dependencies": {
    "express": "^4.17.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.7"
  }
}

```

### Langkah 4: Membangun Aplikasi Menjadi Executable

Gunakan perintah `pkg` untuk membuild aplikasi Anda:

```bash
pkg .
```

Perintah ini akan membuild aplikasi Anda untuk semua platform (Windows, MacOS, Linux) secara default. Jika Anda hanya ingin membuild untuk Windows, Anda bisa menggunakan:

```bash
pkg -t node14-win index.js
```

atau untuk target yang lebih spesifik:

```bash
pkg -t node14-win-x64 index.js
```

Perintah ini akan menghasilkan file executable .exe di direktori proyek Anda.

### Langkah 5: Menjalankan File Executable

Anda sekarang dapat menjalankan file executable yang dihasilkan dengan mengklik dua kali file .exe atau menjalankannya dari command prompt:

```bash
./rest-api.exe
```

### Struktur proyek Anda seperti ini:

```css
rest-api/
├── file.json
├── index.js
├── package.json

```
