"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/_components/ui/table";

export interface DataTableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  actions?: (item: T) => React.ReactNode;
  emptyMessage?: string;
}

export default function DataTable<T>({
  columns,
  data,
  actions,
  emptyMessage = "Nenhum registro encontrado.",
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-md">
      <Table className="min-w-[700px] border-separate border-spacing-y-[4px]">
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={String(col.key)}>{col.label}</TableHead>
            ))}
            {actions && <TableHead className="w-[60px]" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (actions ? 1 : 0)}
                className="text-center text-muted-foreground py-6"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, i) => (
              <TableRow
                key={i}
                className="hover:bg-muted/40 transition-colors text-sm"
              >
                {columns.map((col) => (
                  <TableCell
                    key={String(col.key)}
                    className="py-3 px-4 break-words"
                  >
                    {col.render ? col.render(item) : (item as any)[col.key]}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell className="py-3 px-4">{actions(item)}</TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
