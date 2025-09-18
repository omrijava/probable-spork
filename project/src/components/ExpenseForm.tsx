import React, { useState } from 'react';
import { Plus, Receipt, DollarSign, PoundSterling } from 'lucide-react';
import { Expense, US_EXPENSE_CATEGORIES, UK_EXPENSE_CATEGORIES } from '../types/tax';
import { getCurrentTaxYear } from '../utils/taxYears';

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id' | 'created_at'>) => void;
  country: 'US' | 'UK';
}

export function ExpenseForm({ onAddExpense, country }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    currency: country === 'US' ? 'USD' : 'GBP',
    category: '',
    description: ''
  });

  const Icon = country === 'US' ? DollarSign : PoundSterling;
  const categories = country === 'US' ? US_EXPENSE_CATEGORIES : UK_EXPENSE_CATEGORIES;
  const currentTaxYear = getCurrentTaxYear(country);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const expense: Omit<Expense, 'id' | 'created_at'> = {
      date: formData.date,
      amount: parseFloat(formData.amount),
      currency: formData.currency as 'USD' | 'GBP',
      category: formData.category,
      description: formData.description,
      country,
      tax_year: currentTaxYear
    };

    onAddExpense(expense);
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      currency: country === 'US' ? 'USD' : 'GBP',
      category: '',
      description: ''
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const bgColor = country === 'US' ? 'bg-red-50' : 'bg-orange-50';
  const borderColor = country === 'US' ? 'border-red-200' : 'border-orange-200';
  const accentColor = country === 'US' ? 'text-red-600' : 'text-orange-600';
  const buttonColor = country === 'US' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700';

  return (
    <div className={`${bgColor} ${borderColor} border rounded-lg p-6 mb-6`}>
      <div className={`flex items-center gap-2 mb-4 ${accentColor}`}>
        <Receipt className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Add {country} Expense</h3>
        <span className="text-sm bg-white px-2 py-1 rounded">Tax Year: {currentTaxYear}</span>
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

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Describe the business expense"
            required
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className={`${buttonColor} text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2`}
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </button>
        </div>
      </form>
    </div>
  );
}