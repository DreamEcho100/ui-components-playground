import type { ColumnDef } from "@tanstack/react-table";
// import type { CorrectedColumnDef } from "~/components/ui/data-table/types";
import type { BasicPost, Payment } from "~/config/types";

export type PaymentColumn = ColumnDef<Payment>;
export type BasicPostColumn = ColumnDef<BasicPost>;
