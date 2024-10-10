const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add this line to support JSON parsing

// Serve static files (your HTML and CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle form submission for business registration
app.post('/submit-form', (req, res) => {
    const companyName = req.body['company-name'];
    const email = req.body.email;

    const content = `Nom de l'entreprise: ${companyName}\nEmail: ${email}\n`;

    // Write to file
    fs.writeFile('company-info.txt', content, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).send('Erreur lors de l\'écriture dans le fichier.');
        }
        res.send('Les informations ont été enregistrées avec succès !');
    });
});

// Route to handle user signup
app.post('/signup', (req, res) => {
    const firstName = req.body['first-name'];
    const lastName = req.body['last-name'];
    const phone = req.body.phone;
    const email = req.body.email;
    const password = req.body.password;

    const content = `
        Prénom: ${firstName}
        Nom: ${lastName}
        Téléphone: ${phone}
        Email: ${email}
        Mot de passe: ${password}
    `;

    // Write to file
    fs.writeFile('user-info.txt', content, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).send('Erreur lors de l\'écriture dans le fichier.');
        }
        res.send('Les informations ont été enregistrées avec succès !');
    });
});

// Route to handle user login
app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Read the user-info.txt file to check credentials
    fs.readFile('user-info.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading user info file:', err);
            return res.status(500).send('Erreur lors de la lecture du fichier.');
        }

        // Check if the provided email and password are in the file
        const userInfo = data.split('\n');
        const userEmailLine = userInfo.find(line => line.includes('Email:'));
        const userPasswordLine = userInfo.find(line => line.includes('Mot de passe:'));

        const userEmail = userEmailLine ? userEmailLine.split(': ')[1] : null;
        const userPassword = userPasswordLine ? userPasswordLine.split(': ')[1] : null;

        if (userEmail === email && userPassword === password) {
            res.send('Connexion réussie !');
        } else {
            res.status(401).send('Identifiants invalides.');
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
