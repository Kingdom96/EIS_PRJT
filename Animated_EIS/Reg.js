document.addEventListener("DOMContentLoaded", () => {
    const images = document.querySelectorAll('.background-image');

    function getRandomIndices(count, max) {
        const indices = [];
        while (indices.length < count) {
            const index = Math.floor(Math.random() * max);
            if (!indices.includes(index)) {
                indices.push(index);
            }
        }
        return indices;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function animateImages() {
        // Reset animations
        images.forEach(image => {
            image.style.animation = '';
            image.style.transform = '';
        });

        // Randomly select 3 images to flip
        const flipIndices = getRandomIndices(3, images.length);

        flipIndices.forEach(index => {
            images[index].style.animation = 'flip 5s infinite';
        });

        // Get the non-flipping images
        const nonFlipIndices = Array.from(Array(images.length).keys()).filter(index => !flipIndices.includes(index));

        // Positions
        const positions = ['1 / 1', '1 / 2', '1 / 3', '2 / 1', '2 / 2', '2 / 3'];

        // Assign positions to all images
        const assignedPositions = positions.slice();
        shuffleArray(assignedPositions);

        images.forEach((image, index) => {
            image.style.gridArea = assignedPositions[index];
        });

        // Apply random zoom in/out to non-flipping images
        nonFlipIndices.forEach(index => {
            const zoomIn = Math.random() > 0.5;
            images[index].style.animation = zoomIn ? 'zoomIn 5s infinite' : 'zoomOut 5s infinite';
        });
    }

    setInterval(animateImages, 5000); // Change positions and flip every 5 seconds

    const form = document.getElementById("registrationForm");
    const roleSelect = document.getElementById("role");
    const patientFields = document.getElementById("patient-fields");

    // Show/Hide Patient-Specific Fields Based on Role
    roleSelect.addEventListener("change", () => {
        if (roleSelect.value === "patient") {
            patientFields.style.display = "block";
        } else {
            patientFields.style.display = "none";
        }
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const email = document.getElementById("email").value;
        const role = roleSelect.value;

        // Include patient-specific fields only if the role is "patient"
        const data = { name, username, password, email, role };
        if (role === "patient") {
            data.phone = document.getElementById("phone").value;
            data.address = document.getElementById("address").value;
            data.hospitalId = document.getElementById("hospitalId").value;
        }

        try {
            const response = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert("Registration successful!");
                window.location.href = "login.html";
            } else {
                alert("Registration failed!");
            }
        } catch (err) {
            console.error(err);
            alert("Error occurred during registration!");
        }
    });
});


/*Form Actions*/
const form = document.getElementById("loginForm");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("token", data.token);
            alert("Login successful!");
            if (data.role === "patient") {
                window.location.href = "patient.html";
            } else {
                window.location.href = "provider.html";
            }
        } else {
            alert("Invalid credentials!");
        }
    } catch (err) {
        console.error(err);
        alert("Error occurred during login!");
    }   
    
    
        // Local Storage
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        // Retrieve Role 
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (!token || role !== "expectedRole") {
            alert("Unauthorized access.");
            window.location.href = "login.html";
        }

        // Role-Based Redirect
        if (role === "patient") {
            window.location.href = "patient.html";
        } else if (role === "provider") {
            window.location.href = "provider.html";
        } else {
            alert("Invalid role.");
            window.location.href = "login.html";
        }
});

// Login API    
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

it("should log in a user", (done) => {
    chai.request(app)
        .post("/login")
        .send({ username: "testuser", password: "testpassword" })
        .end((err, res) => {
            chai.expect(res).to.have.status(200);
            chai.expect(res.body).to.have.property("token");
            done();
        });
});


// Test Login
describe('Login Test', () => {
    it('should login and redirect to the patient dashboard', () => {
        cy.visit('/login.html');
        cy.get('#username').type('patient1');
        cy.get('#password').type('password123');
        cy.get('form').submit();
        cy.url().should('include', '/patient.html');
    });
});


// Logout
const logoutButton = document.createElement("button");
logoutButton.textContent = "Logout";
logoutButton.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "login.html";
});
document.body.appendChild(logoutButton);

document.getElementById('backButton').addEventListener('click', function() {
    window.location.href = 'SITE3.html';
});    