"use client";

import React, { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download, Loader2 } from "lucide-react";
import { BookingVoucher } from "./BookingVoucher";

export function VoucherDownloadButton({ booking }: { booking: any }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <button disabled className="w-full bg-white text-zinc-950 font-black py-5 rounded-[2.5rem] shadow-2xl flex items-center justify-center space-x-3 opacity-50 cursor-not-allowed text-sm uppercase tracking-widest">
        <Loader2 className="animate-spin" size={18} />
        <span>Preparing Voucher...</span>
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={<BookingVoucher booking={booking} />}
      fileName={`PassFit-Voucher-${booking.id.substring(0, 8)}.pdf`}
      className="w-full bg-white text-zinc-950 font-black py-5 rounded-[2.5rem] shadow-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all text-sm uppercase tracking-widest"
    >
      {({ loading }) => (
        <>
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
          <span>{loading ? "Generating PDF..." : "Download Voucher"}</span>
        </>
      )}
    </PDFDownloadLink>
  );
}
