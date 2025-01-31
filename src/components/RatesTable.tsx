import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMoney, formatPercentage } from "@/utils/formatters";
import type { Rate } from "@/hooks/useRates";

interface RatesTableProps {
  rates: Rate[];
}

export const RatesTable = ({ rates }: RatesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-primary/10">
          <TableHead className="font-semibold text-primary">Terms</TableHead>
          <TableHead className="font-semibold text-primary">Bank Rate</TableHead>
          <TableHead className="font-semibold text-primary">Our Rate</TableHead>
          <TableHead className="font-semibold text-primary">Monthly Bank Payment</TableHead>
          <TableHead className="font-semibold text-primary">Your Monthly Payment</TableHead>
          <TableHead className="font-semibold text-primary">Your Monthly Savings</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rates.map((rate, index) => (
          <TableRow
            key={rate.id}
            className={`
              transition-colors
              hover:bg-primary/5 
              cursor-pointer
              ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            `}
          >
            <TableCell className="font-medium">{rate.Terms}</TableCell>
            <TableCell>{formatPercentage(rate.BankRate)}</TableCell>
            <TableCell>{formatPercentage(rate.OurRate)}</TableCell>
            <TableCell>{formatMoney(rate.BankMonthly)}</TableCell>
            <TableCell>{formatMoney(rate.OurMonthly)}</TableCell>
            <TableCell className="text-green-600 font-medium">
              {formatMoney(rate.Savings)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};