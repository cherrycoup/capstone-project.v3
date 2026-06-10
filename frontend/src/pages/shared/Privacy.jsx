import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import BackToHomeButton from '../../components/BackToHomeButton';
import logoSrc from '../../assets/logo.webp';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-4">
            <Link to="/" className="flex items-center gap-3 min-w-0 hover:opacity-80 transition">
              <img src={logoSrc} alt="JBM Electro logo" className="h-10 w-10 rounded-xl bg-white p-1 object-contain" />
              <span className="text-lg font-bold text-gray-900 truncate">JBM Electro Ventures</span>
            </Link>
            <BackToHomeButton />
          </div>
        </div>
      </nav>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600 mb-6">This page explains how we collect, use, and protect your personal information.</p>

          <Card>
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3">We collect information you provide when you register, place an order, or contact support (name, email, phone, address). We also collect technical data such as cookies and usage information to improve our services.</p>
            </CardContent>
          </Card>

          <div className="h-6" />

          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>To process orders and provide customer service.</li>
                <li>To send transactional emails like order confirmations.</li>
                <li>To analyze and improve site performance.</li>
              </ul>
              <p className="mt-3">We never sell your personal information to third parties. We may share data with service providers who help us run the site (payment processors, delivery partners) under strict confidentiality.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
