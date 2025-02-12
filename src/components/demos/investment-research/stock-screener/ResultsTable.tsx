
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScreenerData } from "./types";

interface ResultsTableProps {
  results: ScreenerData[];
  formatMarketCap: (value: number | null) => string;
  formatNumber: (num: number | null, decimals?: number) => string;
}

export const ResultsTable = ({ results, formatMarketCap, formatNumber }: ResultsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Market Cap</TableHead>
            <TableHead>P/E Ratio</TableHead>
            <TableHead>Price/Book</TableHead>
            <TableHead>Dividend Yield</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((stock) => (
            <TableRow key={stock.symbol}>
              <TableCell className="font-medium">{stock.symbol}</TableCell>
              <TableCell>{stock.company_name || "N/A"}</TableCell>
              <TableCell>{stock.country || "N/A"}</TableCell>
              <TableCell>{formatMarketCap(stock.market_cap)}</TableCell>
              <TableCell>{formatNumber(stock.pe_ratio)}</TableCell>
              <TableCell>{formatNumber(stock.price_to_book)}</TableCell>
              <TableCell>
                {stock.dividend_yield ? `${formatNumber(stock.dividend_yield)}%` : "N/A"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
