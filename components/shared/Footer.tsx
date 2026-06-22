import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto py-6 bg-card">
      <div className="max-w-5xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted">
        <span>© 2026 RapihinAI. All rights reserved.</span>
        <span className="flex gap-4">
          <a href="#" className="hover:text-foreground">
            Terms of Service
          </a>
          <a href="#" className="hover:text-foreground">
            Privacy Policy
          </a>
        </span>
      </div>
    </footer>
  );
}
