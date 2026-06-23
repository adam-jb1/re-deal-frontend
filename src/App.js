import { useState } from 'react';
import axios from 'axios';

function App() {
  const [form, setForm] = useState({
    address: '',
    purchasePrice: '',
    downPaymentPercent: '',
    interestRate: '',
    loanTermYears: 30,
    monthlyRent: '',
    monthlyExpenses: '',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:3000/api/analyze', {
        ...form,
        purchasePrice: parseFloat(form.purchasePrice),
        downPaymentPercent: parseFloat(form.downPaymentPercent),
        interestRate: parseFloat(form.interestRate),
        loanTermYears: parseInt(form.loanTermYears),
        monthlyRent: parseFloat(form.monthlyRent),
        monthlyExpenses: parseFloat(form.monthlyExpenses),
      });
      setResult(response.data);
    } catch (err) {
      setError('Something went wrong. Make sure your backend is running.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-12 px-4">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">🏠 RE Deal Analyzer</h1>
          <p className="text-gray-500 mt-2">Analyze any rental property investment in seconds</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Property Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Address (optional)</label>
                <input name="address" value={form.address} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123 Main St, Alexandria VA" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Purchase Price ($)</label>
                <input name="purchasePrice" value={form.purchasePrice} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="300000" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Down Payment (%)</label>
                <input name="downPaymentPercent" value={form.downPaymentPercent} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="20" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Interest Rate (%)</label>
                <input name="interestRate" value={form.interestRate} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="7.5" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Loan Term (years)</label>
                <input name="loanTermYears" value={form.loanTermYears} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="30" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Monthly Rent ($)</label>
                <input name="monthlyRent" value={form.monthlyRent} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="2200" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Monthly Expenses ($)</label>
                <input name="monthlyExpenses" value={form.monthlyExpenses} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="400" />
              </div>

            </div>

            <button type="submit" disabled={loading}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200">
              {loading ? 'Analyzing...' : 'Analyze Deal'}
            </button>
          </form>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Results Card */}
        {result && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Analysis Results</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Monthly Mortgage</p>
                <p className="text-2xl font-bold text-gray-800">${result.summary.monthlyMortgage}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Down Payment</p>
                <p className="text-2xl font-bold text-gray-800">${result.summary.downPayment}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Monthly Cash Flow</p>
                <p className={`text-2xl font-bold ${parseFloat(result.metrics.monthlyCashFlow) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${result.metrics.monthlyCashFlow}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Annual Cash Flow</p>
                <p className={`text-2xl font-bold ${parseFloat(result.metrics.annualCashFlow) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${result.metrics.annualCashFlow}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Cap Rate</p>
                <p className="text-2xl font-bold text-gray-800">{result.metrics.capRate}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Cash on Cash Return</p>
                <p className="text-2xl font-bold text-gray-800">{result.metrics.cashOnCashReturn}</p>
              </div>
            </div>

            <div className={`rounded-xl p-4 text-center ${result.metrics.verdict === 'Cash flow positive' ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className={`text-xl font-bold ${result.metrics.verdict === 'Cash flow positive' ? 'text-green-600' : 'text-red-600'}`}>
                {result.metrics.verdict === 'Cash flow positive' ? '✅' : '❌'} {result.metrics.verdict}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;