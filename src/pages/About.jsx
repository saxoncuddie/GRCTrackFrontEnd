import React from 'react';

function About() {
    return (
        <div className="container mt-4">
            <h2>About GRCTrack</h2>

            <p>
                Hello, my name is Saxon Cuddie, and I am the sole developer and designer of this project.
                I am currently a senior at Minot State University, with my major being in Cybersecurity & Operations.
                This project was designed as a demonstration of all the skills I have learned throughout my academic career, as well as an oppurtunity to research and implement various cybersecurity practices for my own project.
                Below is a list of technical features and development tools used.
            </p>

            <hr />

            <h4>Development Tools Used</h4>
            <ul>
                <li><strong>Frontend:</strong> React, Axios, React Router, Bootstrap</li>
                <li><strong>Backend:</strong> Node.js, Express</li>
                <li><strong>Database:</strong> MySQL (hosted on Microsoft Azure)</li>
                <li><strong>Authentication:</strong> JWT (JSON Web Tokens)</li>
                <li><strong>Security:</strong> Helmet, express-rate-limit, express-validator, bcrypt</li>
                <li><strong>File Handling:</strong> Multer, json2csv, pdfkit</li>
                <li><strong>Testing:</strong> Visual Studio for IDE, MySQL Workbench for schema creation and testing, Postman for API testing</li>
            </ul>

            <hr />

            <h4> Security Features Developed</h4>
            <ul>
                <li>User authentication using JWT with role-based access control</li>
                <li>Password hashing to securely store sensitive user information</li>
                <li>Compliance log creation, editing, deletion with audit logging</li>
                <li>GRC Event scheduling with inline editing and role protection</li>
                <li>Audit log viewer (admin only) for all user actions</li>
                <li>Policy Library with secure file uploads and public download access</li>
                <li>User Management panel (admin only) for managing users and roles</li>
                <li>Input validation, rate limiting, and failed login detection</li>
                <li>Fully integrated frontend/dashboard hosted via Azure</li>
            </ul>

            <hr />

            <h4> Deployment & Hosting</h4>
            <p>
                GRCTrack is deployed and hosted via <strong>Microsoft Azure</strong> using Azure Database for MySQL and Node.js App Service
                deployment.
            </p>
        </div>
    );
}

export default About;
