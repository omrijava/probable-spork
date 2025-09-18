import { Income, Expense } from '../types/tax';
import { formatCurrency } from './taxYears';

export function generateSheetsData(incomes: Income[], expenses: Expense[], country: 'US' | 'UK') {
  // Filter by country - the system already handles the currency logic when creating records
  const countryIncomes = incomes.filter(item => item.country === country);
    
  const countryExpenses = expenses.filter(item => item.country === country);
  
  // Income sheet data
  const incomeData = [
    ['Date', 'Source/Client', 'Description', 'Amount', 'Tax Withheld', 'Currency', 'Tax Year'],
    ...countryIncomes.map(income => [
      income.date,
      income.source,
      income.description,
      income.amount.toString(),
      income.tax_withheld?.toString() || '0',
      income.currency,
      income.tax_year
    ])
  ];

  // Expense sheet data
  const expenseData = [
    ['Date', 'Category', 'Description', 'Amount', 'Currency', 'Tax Year'],
    ...countryExpenses.map(expense => [
      expense.date,
      expense.category,
      expense.description,
      expense.amount.toString(),
      expense.currency,
      expense.tax_year
    ])
  ];

  // Summary data - handle mixed currencies for US
  const usdIncome = countryIncomes.filter(i => i.currency === 'USD').reduce((sum, i) => sum + i.amount, 0);
  const gbpIncome = countryIncomes.filter(i => i.currency === 'GBP').reduce((sum, i) => sum + i.amount, 0);
  const usdExpenses = countryExpenses.filter(e => e.currency === 'USD').reduce((sum, e) => sum + e.amount, 0);
  const gbpExpenses = countryExpenses.filter(e => e.currency === 'GBP').reduce((sum, e) => sum + e.amount, 0);

  const summaryData = country === 'US' ? [
    ['Summary', `${country} Tax Data (Worldwide Income)`],
    ['USD Income', formatCurrency(usdIncome, 'USD')],
    ['GBP Income', formatCurrency(gbpIncome, 'GBP')],
    ['USD Expenses', formatCurrency(usdExpenses, 'USD')],
    ['GBP Expenses', formatCurrency(gbpExpenses, 'GBP')],
    ['Export Date', new Date().toISOString().split('T')[0]]
  ] : [
    ['Summary', `${country} Tax Data`],
    ['Total Income', formatCurrency(gbpIncome, 'GBP')],
    ['Total Expenses', formatCurrency(gbpExpenses, 'GBP')],
    ['Net Income', formatCurrency(gbpIncome - gbpExpenses, 'GBP')],
    ['Export Date', new Date().toISOString().split('T')[0]]
  ];

  return {
    income: incomeData,
    expenses: expenseData,
    summary: summaryData
  };
}

export function downloadCSV(data: any[][], filename: string) {
  const csvContent = data.map(row => 
    row.map(field => `"${field}"`).join(',')
  ).join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportAllData(incomes: Income[], expenses: Expense[], country: 'US' | 'UK') {
  const { income, expenses: expenseData, summary } = generateSheetsData(incomes, expenses, country);
  
  // Create a combined CSV for accountant
  const combinedData = [
    ['=== SUMMARY ==='],
    ...summary,
    [''],
    ['=== INCOME ==='],
    ...income,
    [''],
    ['=== EXPENSES ==='],
    ...expenseData
  ];

  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(combinedData, `${country}_tax_data_${timestamp}.csv`);
}