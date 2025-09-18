import React, { useState } from 'react';
import { Plus, DollarSign, PoundSterling } from 'lucide-react';
import { Income } from '../types/tax';
import { getCurrentTaxYear } from '../utils/taxYears';

interface IncomeFormProps {
  onAddIncome: (income: Omit<Income, 'id' | 'created_at'>) => void;
  country: 'US' | 'UK';
}

export function IncomeForm({ onAddIncome, country }: IncomeFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    currency: country === 'US' ? 'USD' : 'GBP',
    source: '',
    description: ''
  });

  const Icon = country === 'US' ? DollarSign : PoundSterling;
  const currentTaxYear = getCurrentTaxYear(country);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const income: Omit<Income, 'id' | 'created_at'> = {
      date: formData.date,
      amount: parseFloat(formData.amount),
      currency: formData.currency as 'USD' | 'GBP',
      source: formData.source,
      description: formData.description,
      country,
      tax_year: currentTaxYear
    };

    onAddIncome(income);
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      currency: country === 'US' ? 'USD' : 'GBP',
      source: '',
      description: ''
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const bgColor = country === 'US' ? 'bg-blue-50' : 'bg-green-50';
  const borderColor = country === 'US' ? 'border-blue-200' : 'border-green-200';
  const accentColor = country === 'US' ? 'text-blue-600' : 'text-green-600';
  const buttonColor = country === 'US' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700';

  return (
    <div className={`${bgColor} ${borderColor} border rounded-lg p-6 mb-6`}>
      <div className={`flex items-center gap-2 mb-4 ${accentColor}`}>
        <Icon className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Add {country} Income</h3>
        <span className="text-sm bg-white px-2 py-1 rounded">Tax Year: {currentTaxYear}</span>
        {country === 'US' && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
            Report all worldwide income
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <div className="flex gap-2">
            <select
              value={formData.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
            </select>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder={`Amount in ${formData.currency}`}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Source/Client
          </label>
          <input
            type="text"
            value={formData.source}
            onChange={(e) => handleChange('source', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Client name or income source"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Description of work/service"
            required
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className={`${buttonColor} text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2`}
          >
            <Plus className="w-4 h-4" />
            Add Income
          </button>
        </div>
      </form>
    </div>
  );
}