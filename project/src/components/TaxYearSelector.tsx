import React from 'react';
import { Calendar } from 'lucide-react';
import { getTaxYears, getCurrentTaxYear } from '../utils/taxYears';

interface TaxYearSelectorProps {
  country: 'US' | 'UK';
  selectedTaxYear: string;
  onSelectTaxYear: (taxYear: string) => void;
}

export function TaxYearSelector({ country, selectedTaxYear, onSelectTaxYear }: TaxYearSelectorProps) {
  const taxYears = getTaxYears(country);
  const currentTaxYear = getCurrentTaxYear(country);
  
  const color = country === 'US' ? 'text-blue-600' : 'text-green-600';
  const bgColor = country === 'US' ? 'bg-blue-50' : 'bg-green-50';

  return (
    <div className={`${bgColor} p-4 rounded-lg mb-6`}>
      <div className={`flex items-center gap-2 mb-3 ${color}`}>
        <Calendar className="w-5 h-5" />
        <h3 className="font-semibold">{country} Tax Year</h3>
        {selectedTaxYear === currentTaxYear && (
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Current</span>
        )}
      </div>
      
      <select
        value={selectedTaxYear}
        onChange={(e) => onSelectTaxYear(e.target.value)}
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        {taxYears.map(taxYear => (
          <option key={taxYear.year} value={taxYear.year}>
            {taxYear.year} ({taxYear.start_date} to {taxYear.end_date})
          </option>
        ))}
      </select>
    </div>
  );
}