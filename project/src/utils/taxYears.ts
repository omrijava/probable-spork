import { TaxYear } from '../types/tax';

export function getCurrentTaxYear(country: 'US' | 'UK'): string {
  const today = new Date();
  const year = today.getFullYear();
  
  if (country === 'US') {
    return year.toString();
  } else {
    // UK tax year runs April 6 - April 5
    const currentYear = today.getMonth() < 3 || (today.getMonth() === 3 && today.getDate() < 6) 
      ? year - 1 
      : year;
    return `${currentYear}-${(currentYear + 1).toString().slice(-2)}`;
  }
}

export function getTaxYears(country: 'US' | 'UK'): TaxYear[] {
  const currentYear = new Date().getFullYear();
  const years: TaxYear[] = [];
  
  for (let i = currentYear + 1; i >= currentYear - 4; i--) {
    if (country === 'US') {
      years.push({
        year: i.toString(),
        country: 'US',
        start_date: `${i}-01-01`,
        end_date: `${i}-12-31`
      });
    } else {
      years.push({
        year: `${i}-${(i + 1).toString().slice(-2)}`,
        country: 'UK',
        start_date: `${i}-04-06`,
        end_date: `${i + 1}-04-05`
      });
    }
  }
  
  return years;
}

export function formatCurrency(amount: number, currency: 'USD' | 'GBP'): string {
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-GB', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

export function isDateInTaxYear(date: string, taxYear: TaxYear): boolean {
  const checkDate = new Date(date);
  const startDate = new Date(taxYear.start_date);
  const endDate = new Date(taxYear.end_date);
  
  return checkDate >= startDate && checkDate <= endDate;
}