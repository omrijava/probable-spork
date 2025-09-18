import React, { useState, useEffect } from 'react';
import { Calculator, FileText, Users, Settings } from 'lucide-react';
import { Income, Expense } from './types/tax';
import { IncomeForm } from './components/IncomeForm';
import { ExpenseForm } from './components/ExpenseForm';
import { UnifiedIncomeForm } from './components/UnifiedIncomeForm';
import { UnifiedExpenseForm } from './components/UnifiedExpenseForm';
import { TransactionList } from './components/TransactionList';
import { TaxYearSelector } from './components/TaxYearSelector';
import { EditIncomeModal } from './components/EditIncomeModal';
import { EditExpenseModal } from './components/EditExpenseModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getCurrentTaxYear } from './utils/taxYears';
import { exportAllData } from './utils/exportToSheets';

function App() {
  const [activeTab, setActiveTab] = useState<'entry' | 'US' | 'UK'>('UK');
  const [activeSection, setActiveSection] = useState<'income' | 'expenses' | 'overview'>('overview');
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  
  const [incomes, setIncomes] = useLocalStorage<Income[]>('tax-incomes', []);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('tax-expenses', []);
  const [selectedTaxYearUS, setSelectedTaxYearUS] = useLocalStorage('selected-tax-year-us', getCurrentTaxYear('US'));
  const [selectedTaxYearUK, setSelectedTaxYearUK] = useLocalStorage('selected-tax-year-uk', getCurrentTaxYear('UK'));

  const selectedTaxYear = activeTab === 'US' ? selectedTaxYearUS : activeTab === 'UK' ? selectedTaxYearUK : selectedTaxYearUS;
  const setSelectedTaxYear = activeTab === 'US' ? setSelectedTaxYearUS : activeTab === 'UK' ? setSelectedTaxYearUK : setSelectedTaxYearUS;

  const addIncome = (income: Omit<Income, 'id' | 'created_at' | 'country' | 'tax_year'>) => {
    if (income.currency === 'GBP') {
      // GBP income goes to both US and UK
      const ukIncome: Income = {
        ...income,
        id: crypto.randomUUID(),
        country: 'UK',
        tax_year: selectedTaxYearUK,
        created_at: new Date().toISOString()
      };
      const usIncome: Income = {
        ...income,
        id: crypto.randomUUID(),
        country: 'US',
        tax_year: selectedTaxYearUS,
        created_at: new Date().toISOString()
      };
      setIncomes(prev => [...prev, ukIncome, usIncome]);
    } else {
      // USD income only goes to US
      const newIncome: Income = {
        ...income,
        id: crypto.randomUUID(),
        country: 'US',
        tax_year: selectedTaxYearUS,
        created_at: new Date().toISOString()
      };
      setIncomes(prev => [...prev, newIncome]);
    }
  };

  const addExpense = (expense: Omit<Expense, 'id' | 'created_at' | 'country' | 'tax_year'>) => {
    if (expense.currency === 'GBP') {
      // GBP expenses go to both US and UK
      const ukExpense: Expense = {
        ...expense,
        id: crypto.randomUUID(),
        country: 'UK',
        tax_year: selectedTaxYearUK,
        created_at: new Date().toISOString()
      };
      const usExpense: Expense = {
        ...expense,
        id: crypto.randomUUID(),
        country: 'US',
        tax_year: selectedTaxYearUS,
        created_at: new Date().toISOString()
      };
      setExpenses(prev => [...prev, ukExpense, usExpense]);
    } else {
      // USD expenses only go to US
      const newExpense: Expense = {
        ...expense,
        id: crypto.randomUUID(),
        country: 'US',
        tax_year: selectedTaxYearUS,
        created_at: new Date().toISOString()
      };
      setExpenses(prev => [...prev, newExpense]);
    }
  };

  // Legacy functions for backward compatibility - now just redirect to unified functions
  const addIncomeOld = (income: Omit<Income, 'id' | 'created_at'>) => {
    const newIncome: Income = {
      ...income,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    };
    setIncomes(prev => [...prev, newIncome]);
  };

  const addExpenseOld = (expense: Omit<Expense, 'id' | 'created_at'>) => {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const deleteIncome = (id: string) => {
    setIncomes(prev => prev.filter(income => income.id !== id));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const editIncome = (updatedIncome: Income) => {
    setIncomes(prev => prev.map(income => 
      income.id === updatedIncome.id ? updatedIncome : income
    ));
    setEditingIncome(null);
  };

  const editExpense = (updatedExpense: Expense) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === updatedExpense.id ? updatedExpense : expense
    ));
    setEditingExpense(null);
  };

  const handleExport = () => {
    if (activeTab === 'US' || activeTab === 'UK') {
      exportAllData(incomes, expenses, activeTab);
    }
  };

  const getTabColor = (tab: string) => {
    if (tab === 'US') return 'border-blue-500 text-blue-600';
    if (tab === 'UK') return 'border-green-500 text-green-600';
    return 'border-purple-500 text-purple-600';
  };
  
  const getActiveBg = () => {
    if (activeTab === 'US') return 'bg-blue-50';
    if (activeTab === 'UK') return 'bg-green-50';
    return 'bg-purple-50';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-3">
              <Calculator className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tax Tracker Pro</h1>
                <p className="text-sm text-gray-600">Dual Country Self-Employment Tax Management</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Current Tax Years: US {getCurrentTaxYear('US')} • UK {getCurrentTaxYear('UK')}
            </div>
          </div>

          {/* Country Tabs */}
          <div className="flex space-x-8 border-b">
            <button
              onClick={() => setActiveTab('entry')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'entry'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📝 Data Entry
            </button>
            <button
              onClick={() => {
                setActiveTab('UK');
                setActiveSection('overview');
              }}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'UK'
                  ? getTabColor('UK')
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🇬🇧 United Kingdom
            </button>
            <button
              onClick={() => {
                setActiveTab('US');
                setActiveSection('overview');
              }}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'US'
                  ? getTabColor('US')
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🇺🇸 United States
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tax Year Selector */}
        {activeTab !== 'entry' && (
          <TaxYearSelector
            country={activeTab as 'US' | 'UK'}
            selectedTaxYear={selectedTaxYear}
            onSelectTaxYear={setSelectedTaxYear}
          />
        )}

        {/* Section Navigation */}
        <div className={`${getActiveBg()} rounded-lg p-6 mb-8`}>
          {activeTab === 'entry' && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-purple-700 mb-2">Universal Data Entry</h2>
              <p className="text-gray-600 text-sm">
                Enter your income and expenses once. The system automatically allocates them to the correct tax forms:
                <br />• <strong>GBP transactions</strong> → Both US and UK tax forms (US reports worldwide income)
                <br />• <strong>USD transactions</strong> → US tax form only
              </p>
            </div>
          )}
          
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveSection('overview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeSection === 'overview'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:bg-white hover:shadow-sm'
              }`}
            >
              <FileText className="w-4 h-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveSection('income')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeSection === 'income'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:bg-white hover:shadow-sm'
              }`}
            >
              <Users className="w-4 h-4" />
              Add Income
            </button>
            <button
              onClick={() => setActiveSection('expenses')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeSection === 'expenses'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:bg-white hover:shadow-sm'
              }`}
            >
              <Settings className="w-4 h-4" />
              Add Expenses
            </button>
          </div>

          {/* Content Sections */}
          {activeSection === 'income' && (
            activeTab === 'entry' ? (
              <UnifiedIncomeForm onAddIncome={addIncome} />
            ) : (
              <IncomeForm onAddIncome={addIncomeOld} country={activeTab as 'US' | 'UK'} />
            )
          )}

          {activeSection === 'expenses' && (
            activeTab === 'entry' ? (
              <UnifiedExpenseForm onAddExpense={addExpense} />
            ) : (
              <ExpenseForm onAddExpense={addExpenseOld} country={activeTab as 'US' | 'UK'} />
            )
          )}

          {activeSection === 'overview' && activeTab !== 'entry' && (
            <TransactionList
              incomes={incomes.filter(income => income.tax_year === selectedTaxYear)}
              expenses={expenses.filter(expense => expense.tax_year === selectedTaxYear)}
              country={activeTab as 'US' | 'UK'}
              onDeleteIncome={deleteIncome}
              onDeleteExpense={deleteExpense}
              onEditIncome={setEditingIncome}
              onEditExpense={setEditingExpense}
              onExport={handleExport}
            />
          )}
          
          {activeSection === 'overview' && activeTab === 'entry' && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Tax Form to View</h3>
              <p className="text-gray-600">Choose the US or UK tab above to view your tax summaries and export data.</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Getting Started</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-green-700 mb-2">1. Track Income</h4>
              <p className="text-gray-600">
                Enter income as you receive payments. Choose the correct currency for each payment.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-orange-700 mb-2">2. Log Expenses</h4>
              <p className="text-gray-600">
                Add business expenses weekly using the appropriate tax categories for each country.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-purple-700 mb-2">3. Currency Logic</h4>
              <p className="text-gray-600">
                US reports all worldwide income. UK only reports GBP income. The system handles this automatically.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-700 mb-2">4. Export Data</h4>
              <p className="text-gray-600">
                Export your data as CSV files for Google Sheets or your accountant.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modals */}
      {editingIncome && (
        <EditIncomeModal
          income={editingIncome}
          onSave={editIncome}
          onClose={() => setEditingIncome(null)}
        />
      )}

      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onSave={editExpense}
          onClose={() => setEditingExpense(null)}
        />
      )}
    </div>
  );
}

export default App;