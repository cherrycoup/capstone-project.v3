import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import BackToHomeButton from '../../components/BackToHomeButton';
import logoSrc from '../../assets/logo.webp';

export default function Terms() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
          <p className="text-gray-600 mb-6">Please read these terms carefully before using our website or making a purchase.</p>

          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3">These Terms govern your access to and use of our services, including purchases made through our website. By using the site, you agree to be bound by these Terms.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>All orders are subject to availability and confirmation of the order price.</li>
                <li>We reserve the right to refuse or cancel orders for any reason.</li>
                <li>Prices, promotions, and product information may change without notice.</li>
              </ul>
            </CardContent>
          </Card>

          <div className="h-6" />

          <Card>
            <CardHeader>
              <CardTitle>Purchases & Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3">When you place an order, you agree to provide accurate payment and contact information. Payment methods and billing terms are displayed during checkout.</p>
              <p className="mb-3">If you dispute a charge, contact us first so we can resolve the issue.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
