"use client";

import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              
              <span className="text-xl font-bold text-slate-900">Interview-Genie</span>
            </div>
            <p className="text-slate-600">
              AI powered mock interview platform to help you ace your next interview.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-slate-600">
              <li><Link href="/features" className="hover:text-slate-900 transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-slate-900 transition-colors">Pricing</Link></li>
              <li><Link href="/demo" className="hover:text-slate-900 transition-colors">Demo</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-slate-600">
              <li><Link href="/about" className="hover:text-slate-900 transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-slate-900 transition-colors">Contact</Link></li>
              <li><Link href="/careers" className="hover:text-slate-900 transition-colors">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-slate-600">
              <li><Link href="/help" className="hover:text-slate-900 transition-colors">Help Center</Link></li>
              <li><Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-8 pt-8 text-center text-slate-500">
          <p>&copy; 2026 Interview-Genie. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
