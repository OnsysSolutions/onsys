"use client";

import { Table } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/_components/ui/empty";

export const title = "Empty Table";

const EmptyData = ({
  message,
  description,
}: {
  message: string;
  description: string;
}) => (
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <Table />
      </EmptyMedia>
      <EmptyTitle>{message}</EmptyTitle>
      <EmptyDescription>{description}</EmptyDescription>
    </EmptyHeader>
  </Empty>
);

export default EmptyData;
