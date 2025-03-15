// Register Endpoint

app.post("/register", async (req, res) => {
    const { name, username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, ?)";
    db.query(query, [name, username, hashedPassword, role], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send("User registered successfully!");
    });
});


// Login Endpoint

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const query = "SELECT * FROM users WHERE username = ?";
    db.query(query, [username], async (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(401).send("Invalid credentials!");

        const user = results[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).send("Invalid credentials!");

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ token, role: user.role });
    });
});

// Local Storage
localStorage.setItem("token", data.token);
localStorage.setItem("role", data.role);


// Data Role
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token) {
    alert("You must log in first!");
    window.location.href = "login.html";
}

// Retrieve Role
if (role === "patient") {
    window.location.href = "patient.html";
} else if (role === "provider") {
    window.location.href = "provider.html";
} else {
    alert("Invalid role!");
    window.location.href = "login.html";
}

