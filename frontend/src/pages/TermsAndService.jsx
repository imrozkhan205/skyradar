import React from "react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-sky-400">Terms of Service</h1>

        <p className="mb-4">
          Welcome to <strong>SkyRadar</strong>. By using our service, you agree to the following terms. If you do not agree with these terms, please do not use our application.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. Usage</h2>
        <p className="mb-4">
          SkyRadar is a free and open-source flight tracking platform built for educational and informational purposes. You agree not to use the service for any illegal or unauthorized purpose.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. Account</h2>
        <p className="mb-4">
          You are responsible for maintaining the confidentiality of your account and password. We are not liable for any loss or damage arising from unauthorized access to your account.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Accuracy</h2>
        <p className="mb-4">
          Flight data is fetched from external APIs like OpenSky Network. We do not guarantee the accuracy, completeness, or timeliness of the data.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Termination</h2>
        <p className="mb-4">
          We reserve the right to suspend or terminate your access to SkyRadar at any time, without notice or liability, for any reason.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. Changes to Terms</h2>
        <p className="mb-4">
          We may update these Terms of Service from time to time. Continued use of the service means you accept the new terms.
        </p>

        <p className="text-sm text-gray-400 mt-8">
          For questions, contact us at <a href="mailto:imrozkhan2258@gmail.com" className="text-sky-400 underline">imrozkhan2258@gmail.com</a>.
        </p>

        <Link to="/" className="inline-block mt-6 text-sky-400 hover:underline">
          ← Back to Signup
        </Link>
      </div>
    </div>
  );
};

export default TermsOfService;
