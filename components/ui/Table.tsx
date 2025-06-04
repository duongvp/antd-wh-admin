"use client";
import React from "react";
import { Table } from "antd";
import type { TableProps, GetProp } from "antd";

type ColumnsType<T extends object> = GetProp<TableProps<T>, "columns">;

interface CustomTableProps<T extends object> extends TableProps<T> {
  columns: ColumnsType<T>;
  dataSource: T[];
  onRow?: TableProps<T>['onRow'];
}

function CustomTable<T extends object>({
  columns,
  dataSource,
  ...rest
}: CustomTableProps<T>) {
  return <Table<T> columns={columns} dataSource={dataSource} {...rest} />;
}

export default CustomTable;
