import React from 'react';
import { Trash2, Download, Calendar, Edit } from 'lucide-react';
import { Income, Expense } from '../types/tax';
import { formatCurrency } from '../utils/taxYears';

interface TransactionListProps {
  incomes: Income[];
  expenses: Expense[];
  country: 'US' | 'UK';
  onDeleteIncome: (id: string) => void;
  onDeleteExpense: (id: string) => void;
  onEditIncome: (income: Income) => void;
  onEditExpense: (expense: Expense) => void;
  onExport: () => void;
}

export function TransactionList({ 
  incomes, 
  expenses, 
  country, 
  onDeleteIncome, 
  onDeleteExpense, 
  onEditIncome,
  onEditExpense,
  onExport 
}: TransactionListProps) {
  // US reports all income (worldwide), UK only reports GBP income
  const countryIncomes = country === 'US' 
    ? incomes.filter(income => income.country === 'US') // US shows all income entered under US (both USD and GBP)
    : incomes.filter(income => income.country === 'UK'); // UK shows all income entered under UK (should only be GBP)
    
  const countryExpenses = country === 'US'
    ? expenses.filter(expense => expense.country === 'US') // US shows all expenses entered under US (both USD and GBP)
    : expenses.filter(expense => expense.country === 'UK'); // UK shows all expenses entered under UK (should only be GBP)
  
  const headerColor = country === 'US' ? 'bg-blue-600' : 'bg-green-600';
  const incomeColor = country === 'US' ? 'bg-blue-50' : 'bg-green-50';
  const expenseColor = country === 'US' ? 'bg-red-50' : 'bg-orange-50';

  // For US, we need to handle mixed currencies
  const formatAmount = (amount: number, currency: 'USD' | 'GBP') => {
    return formatCurrency(amount, currency);
  };

  // Calculate totals by currency for US
  const usdIncome = countryIncomes.filter(i => i.currency === 'USD').reduce((sum, i) => sum + i.amount, 0);
  const gbpIncome = countryIncomes.filter(i => i.currency === 'GBP').reduce((sum, i) => sum + i.amount, 0);
  const usdExpenses = countryExpenses.filter(e => e.currency === 'USD').reduce((sum, e) => sum + e.amount, 0);
  const gbpExpenses = countryExpenses.filter(e => e.currency === 'GBP').reduce((sum, e) => sum + e.amount, 0);

  // For UK, calculate totals (should only be GBP)
  const totalIncome = countryIncomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = countryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netIncome = totalIncome - totalExpenses;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className={`${headerColor} text-white p-4 rounded-lg mb-6`}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {country} Tax Summary
            {country === 'US' && (
              <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">
                Worldwide Income
              </span>
            )}
          </h2>
          <button
            onClick={onExport}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded transition-all duration-200 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export to Sheets
          </button>
        </div>
        {country === 'US' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm opacity-80 mb-2">Income by Currency</p>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm">USD:</span>
                  <span className="text-lg font-bold">{formatCurrency(usdIncome, 'USD')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">GBP:</span>
                  <span className="text-lg font-bold">{formatCurrency(gbpIncome, 'GBP')}</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm opacity-80 mb-2">Expenses by Currency</p>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm">USD:</span>
                  <span className="text-lg font-bold">{formatCurrency(usdExpenses, 'USD')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">GBP:</span>
                  <span className="text-lg font-bold">{formatCurrency(gbpExpenses, 'GBP')}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-sm opacity-80">Total Income</p>
              <p className="text-2xl font-bold">{formatCurrency(totalIncome, 'GBP')}</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Total Expenses</p>
              <p className="text-2xl font-bold">{formatCurrency(totalExpenses, 'GBP')}</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Net Income</p>
              <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                {formatCurrency(netIncome, 'GBP')}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income List */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-green-700">Income Records</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {countryIncomes.length === 0 ? (
              <p className="text-gray-500 italic">No income records yet</p>
            ) : (
              countryIncomes.map(income => (
                <div key={income.id} className={`${incomeColor} p-4 rounded-lg border`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{income.source}</p>
                      <p className="text-sm text-gray-600">{income.description}</p>
                      {income.tax_withheld && (
                        <p className="text-xs text-orange-600 font-medium">
                          Tax withheld: {formatAmount(income.tax_withheld, income.currency)}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">{income.date}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <p className="font-bold text-green-700">
                        {formatAmount(income.amount, income.currency)}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEditIncome(income)}
                          className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteIncome(income.id)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Expense List */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-red-700">Expense Records</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {countryExpenses.length === 0 ? (
              <p className="text-gray-500 italic">No expense records yet</p>
            ) : (
              countryExpenses.map(expense => (
                <div key={expense.id} className={`${expenseColor} p-4 rounded-lg border`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{expense.category}</p>
                      <p className="text-sm text-gray-600">{expense.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{expense.date}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <p className="font-bold text-red-700">
                        {formatAmount(expense.amount, expense.currency)}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEditExpense(expense)}
                          className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteExpense(expense.id)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}