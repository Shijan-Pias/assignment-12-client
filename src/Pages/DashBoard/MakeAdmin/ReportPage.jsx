import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";


const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // change if needed
});

export default function ReportAdmin() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: sales = [], refetch, isLoading } = useQuery({
    queryKey: ["sales-report", startDate, endDate],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/sales-report", {
        params: { startDate, endDate },
      });
      return res.data.data;
    },
  });

  const columns = [
    { name: "Medicine", selector: row => row.medicineInfo.itemName, sortable: true },
    { name: "Seller", selector: row => row.sellerEmail },
    { name: "Buyer", selector: row => row.finalEmail },
    { name: "Price", selector: row => row.priceTk, sortable: true },
    { name: "Transaction ID", selector: row => row.transactionId },
    { name: "Status", selector: row => row.status },
    { name: "Paid At", selector: row => new Date(row.createdAt).toLocaleString() },
  ];

  // Export Excel
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(sales);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales");
    XLSX.writeFile(wb, "sales-report.xlsx");
  };

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Sales Report", 14, 10);
    doc.autoTable({
      head: [["Medicine", "Seller", "Buyer", "Price", "Transaction", "Status"]],
      body: sales.map(s => [
        s.medicineInfo.itemName,
        s.sellerEmail,
        s.finalEmail,
        s.priceTk,
        s.transactionId,
        s.status,
      ]),
    });
    doc.save("sales-report.pdf");
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Admin Sales Report</h2>

      {/* Date Filter */}
      <div className="flex gap-2 mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={() => refetch()}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Filter
        </button>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-3 mb-4">
        <button onClick={exportExcel} className="bg-green-500 text-white px-4 rounded">Export Excel</button>
        <button onClick={exportPDF} className="bg-red-500 text-white px-4 rounded">Export PDF</button>
      </div>

      {/* Table */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <DataTable
          columns={columns}
          data={sales}
          pagination
          highlightOnHover
          striped
        />
      )}
    </div>
  );
}
