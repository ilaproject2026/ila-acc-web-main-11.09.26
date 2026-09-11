import React from 'react';
import { Shield, Lock, FileText, Database, Globe } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-md rounded-lg">
        <div className="text-center mb-12">
          <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-gray-500">Effective Date: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-blue max-w-none text-gray-700">
          <p className="text-lg mb-8">
            At ILA Global, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or engage with our platform. We are committed to complying with the General Data Protection Regulation (GDPR) and ensuring your data is secure.
          </p>

          <div className="space-y-8">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900 m-0">1. Information We Collect</h2>
              </div>
              <p>We may collect information about you in a variety of ways. The information we may collect includes:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, telephone number, and demographic information that you voluntarily give to us when registering or requesting services.</li>
                <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the site, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the Site.</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900 m-0">2. How We Use Your Information</h2>
              </div>
              <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Create and manage your account.</li>
                <li>Process applications and deliver requested services.</li>
                <li>Improve our website and services based on user behavior and analytics.</li>
                <li>Send you emails regarding your account or order.</li>
                <li>Respond to product and customer service requests.</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900 m-0">3. Cookies and Tracking Technologies</h2>
              </div>
              <p>
                We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. 
                When you access the Site, your personal information is not collected through the use of tracking technology without your consent.
              </p>
              <p className="mt-2">
                We utilize a cookie consent banner to ensure you have full control over your tracking preferences. You can accept or decline non-essential cookies. We only use strictly necessary cookies to maintain session security and essential site functionality unless you grant us broader consent.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900 m-0">4. Data Security</h2>
              </div>
              <p>
                We use administrative, technical, and physical security measures to help protect your personal information. 
                While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900 m-0">5. Your GDPR Rights</h2>
              </div>
              <p>If you are a resident of the European Economic Area (EEA), you have certain data protection rights under the GDPR. These include:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>The right to access, update or delete the information we have on you.</li>
                <li>The right of rectification. You have the right to have your information rectified if that information is inaccurate or incomplete.</li>
                <li>The right to object. You have the right to object to our processing of your Personal Data.</li>
                <li>The right of restriction. You have the right to request that we restrict the processing of your personal information.</li>
                <li>The right to data portability.</li>
                <li>The right to withdraw consent at any time where we relied on your consent to process your personal information.</li>
              </ul>
            </section>

            <section className="pt-6 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Contact Us</h2>
              <p>
                If you have questions or comments about this Privacy Policy or wish to exercise your rights, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-100">
                <p className="font-semibold text-gray-900">ILA Global Data Protection Officer</p>
                <p>Email: privacy@ilaglobal.com</p>
                <p>Phone: +49 123 456 7890</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
