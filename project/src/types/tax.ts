export interface Income {
  id: string;
  date: string;
  amount: number;
  tax_withheld?: number;
  currency: 'USD' | 'GBP';
  source: string;
  description: string;
  country: 'US' | 'UK';
  tax_year: string;
  created_at: string;
}

export interface Expense {
  id: string;
  date: string;
  amount: number;
  currency: 'USD' | 'GBP';
  category: string;
  description: string;
  country: 'US' | 'UK';
  tax_year: string;
  receipt_url?: string;
  created_at: string;
}

export interface TaxYear {
  year: string;
  country: 'US' | 'UK';
  start_date: string;
  end_date: string;
}

// US Schedule C Categories
export const US_EXPENSE_CATEGORIES = [
  'Advertising',
  'Car and truck expenses',
  'Commissions and fees',
  'Contract labor',
  'Depreciation',
  'Employee benefit programs',
  'Insurance (other than health)',
  'Interest',
  'Legal and professional services',
  'Office expense',
  'Rent or lease',
  'Repairs and maintenance',
  'Supplies',
  'Taxes and licenses',
  'Travel and meals',
  'Utilities',
  'Wages',
  'Other expenses'
];

// UK Self-Employment Categories
export const UK_EXPENSE_CATEGORIES = [
  'Office costs (including working from home)',
  'Travel costs (business trips)',
  'Clothing expenses (uniforms, protective)',
  'Staff costs (salaries, benefits, subcontractors)',
  'Stock and raw materials',
  'Legal and financial costs',
  'Insurance',
  'Marketing and entertainment',
  'Training courses',
  'Equipment and machinery',
  'Professional fees',
  'Bank charges',
  'Other business expenses'
];