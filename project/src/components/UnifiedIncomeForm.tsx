import React, { useState } from 'react';
import { Plus, DollarSign, PoundSterling, Globe } from 'lucide-react';
import { Income } from '../types/tax';

interface UnifiedIncomeFormProps {
  onAddIncome: (income: Omit<Income, 'id' | 'created_at' | 'country' | 'tax_year'>) => void;
}

export function UnifiedIncomeForm({ onAddIncome }: UnifiedIncomeFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    tax_withheld: '',
    currency: 'GBP' as 'USD' | 'GBP',
    source: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const income = {
      date: formData.date,
      amount: parseFloat(formData.amount),
      tax_withheld: formData.tax_withheld ? parseFloat(formData.tax_withheld) : undefined,
      currency: formData.currency,
      source: formData.source,
      description: formData.description
    };

    onAddIncome(income);
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      tax_withheld: '',
      currency: 'GBP',
      source: '',
      description: ''
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const Icon = formData.currency === 'USD' ? DollarSign : PoundSterling;
  const allocation = formData.currency === 'GBP' ? 'UK + US Tax Forms' : 'US Tax Form Only';
  const allocationColor = formData.currency === 'GBP' ? 'text-green-600' : 'text-blue-600';

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4 text-purple-700">
        <Globe className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Add Income</h3>
        <div className={`text-sm px-3 py-1 rounded-full bg-white ${allocationColor} font-medium`}>
          → {allocation}
        </div>
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
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount & Currency
          </label>
          <div className="flex gap-2">
            <select
              value={formData.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="w-20 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            >
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
            </select>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder={`Amount in ${formData.currency}`}
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {formData.currency === 'GBP' 
              ? '🇬🇧 UK income - will appear on both US and UK tax forms'
              : '🇺🇸 US income - will appear on US tax form only'
            }
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tax Withheld (Optional)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.tax_withheld}
            onChange={(e) => handleChange('tax_withheld', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder={`Tax withheld in ${formData.currency}`}
          />
          <p className="text-xs text-gray-500 mt-1">
            Amount of tax already deducted by the client/payer
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Source/Client
          </label>
          <input
            type="text"
            value={formData.source}
            onChange={(e) => handleChange('source', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
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
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder="Description of work/service"
            required
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Income
          </button>
        </div>
      </form>
    </div>
  );
}