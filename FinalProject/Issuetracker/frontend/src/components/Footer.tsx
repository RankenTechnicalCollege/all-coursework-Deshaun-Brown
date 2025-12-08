import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div>
            <Link to="/dashboard" className="flex items-center justify-center gap-1 mb-2 pr-17">
              <span className="text-2xl">🐛</span>
              <p className="text-sm text-muted-foreground">
          IssueTracker © {currentYear}
        </p>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A comprehensive bug tracking system for managing software defects during the development lifecycle.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
          Developed by Deshaun Brown
        </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/bug/list" className="text-muted-foreground hover:text-primary transition-colors">
                  Bug Tracker
                </Link>
              </li>
              <li>
                <Link to="/user/list" className="text-muted-foreground hover:text-primary transition-colors">
                  User Management
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Report Bug
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  License
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              &copy; {currentYear} Issue Tracker. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground font-medium">
              Developed by <span className="text-primary">DeSean Brown</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;