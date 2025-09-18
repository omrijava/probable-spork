import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Expense, US_EXPENSE_CATEGORIES, UK_EXPENSE_CATEGORIES } from '../types/tax';

interface EditExpenseModalProps {
  expense: Expense;
  onSave: (updatedExpense: Expense) => void;
  onClose: () => void;
}

export function EditExpenseModal({ expense, onSave, onClose }: EditExpenseModalProps) {
  const [formData, setFormData] = useState({
    date: expense.date,
    amount: expense.amount.toString(),
    currency: expense.currency,
    category: expense.category,
    description: expense.description
  });

  const categories = formData.currency === 'GBP' ? UK_EXPENSE_CATEGORIES : US_EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedExpense: Expense = {
      ...expense,
      date: formData.date,
      amount: parseFloat(formData.amount),
      currency: formData.currency as 'USD' | 'GBP',
      category: formData.category,
      description: formData.description
    };

    onSave(updatedExpense);
  };

  const handleChange = (field: string, value: string) => {
    // Reset category when currency changes
    if (field === 'currency') {
      setFormData(prev => ({ ...prev, [field]: value, category: '' }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Edit Expense</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                required
              />
            </div>
          </div>

          <div>
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}