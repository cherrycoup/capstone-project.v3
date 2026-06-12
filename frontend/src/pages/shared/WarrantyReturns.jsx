import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import BackToHomeButton from '../../components/BackToHomeButton';
import logoSrc from '../../assets/logo.webp';

export default function WarrantyReturns() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Warranty & Returns</h1>
          <p className="text-gray-600 mb-6">Clear information about product warranties and how to return an item.</p>

          <Card>
            <CardHeader>
              <CardTitle>Warranty</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3">Most products purchased from our store include a limited manufacturer warranty. The warranty covers defects in materials and workmanship under normal use for the period specified on the product page or accompanying documentation.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Warranty begins on the date of delivery.</li>
                <li>Coverage varies by product — check the product details.</li>
                <li>Damage caused by misuse, accidents, or unauthorized repair is not covered.</li>
              </ul>
            </CardContent>
          </Card>

          <div className="h-6" />

          <Card>
            <CardHeader>
              <CardTitle>Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3">If you need to return a product, follow these steps:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Contact our Support team within 14 days of delivery to start a return.</li>
                <li>Provide your order number and a brief description of the reason for return.</li>
                <li>Pack the item in its original packaging when possible and include all accessories.</li>
                <li>We will provide a return authorization and instructions for shipping.</li>
              </ol>
              <p className="mt-3">After we receive and inspect the item, we will process a refund or replacement according to our policy.</p>
              <p className="mt-3">For warranty repairs, we will coordinate with the manufacturer or authorized service center.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
