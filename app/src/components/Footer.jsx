import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* One-line developer info */}
        <span>
          &copy; {new Date().getFullYear()}{" "}
          <strong>
            <a
              href="https://phathurakhunwana.netlify.app/" 
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#3a82f7;", textDecoration: "none" }}
            >
              Phathutshedzo Rakhunwana
            </a>
          </strong>{" "}
          — Front-End Developer & WordPress Specialist. All rights reserved.
        </span>

        {/* Links with icons */}
        <div className="footer-links">
          <a
            href="https://www.linkedin.com/in/phathutshedzo-rakhunwana/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin style={{ marginRight: "4px" }} /> LinkedIn
          </a>
          <a
            href="https://github.com/Phathu87/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub style={{ marginRight: "4px" }} /> GitHub
          </a>
          <a href="mailto:phathurakhunwana@gmail.com">
            <FaEnvelope style={{ marginRight: "4px" }} /> Email
          </a>
        </div>
      </div>
    </footer>
  );
}
