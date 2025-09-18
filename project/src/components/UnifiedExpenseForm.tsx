import React, { useState } from 'react';
import { Plus, Receipt, Globe } from 'lucide-react';
import { Expense, US_EXPENSE_CATEGORIES, UK_EXPENSE_CATEGORIES } from '../types/tax';

interface UnifiedExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id' | 'created_at' | 'country' | 'tax_year'>) => void;
}

export function UnifiedExpenseForm({ onAddExpense }: UnifiedExpenseFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    currency: 'GBP' as 'USD' | 'GBP',
    category: '',
    description: ''
  });

  // Get categories based on currency - if GBP, show UK categories, if USD show US categories
  const categories = formData.currency === 'GBP' ? UK_EXPENSE_CATEGORIES : US_EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const expense = {
      date: formData.date,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      category: formData.category,
      description: formData.description
    };

    onAddExpense(expense);
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      currency: 'GBP',
      category: '',
      description: ''
    });
  };

  const handleChange = (field: string, value: string) => {
    // Reset category when currency changes
    if (field === 'currency') {
      setFormData(prev => ({ ...prev, [field]: value, category: '' }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const allocation = formData.currency === 'GBP' ? 'US + UK Tax Forms' : 'US Tax Form Only';
  const allocationColor = formData.currency === 'GBP' ? 'text-green-600' : 'text-blue-600';

  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4 text-orange-700">
        <Receipt className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Add Expense</h3>
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
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
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
              className="w-20 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            >
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
            </select>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              placeholder={`Amount in ${formData.currency}`}
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {formData.currency === 'GBP' 
              ? '🇬🇧 UK expense - will appear on both US and UK tax forms'
              : '🇺🇸 US expense - will appear on US tax form only'
            }
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category ({formData.currency === 'GBP' ? 'UK' : 'US'} Tax Categories)
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Categories automatically match {formData.currency === 'GBP' ? 'UK self-employment' : 'US Schedule C'} requirements
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            placeholder="Describe the business expense"
            required
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </button>
        </div>
      </form>
    </div>
  );
}