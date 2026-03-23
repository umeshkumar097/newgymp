"use client";

import React, { useState } from "react";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { deleteUser } from "@/app/actions/admin";

interface DeleteUserButtonProps {
  userId: string;
  userName: string;
}

export function DeleteUserButton({ userId, userName }: DeleteUserButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await deleteUser(userId);
    if (!res.success) {
      alert(res.error || "Failed to delete user");
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center space-x-2 animate-in fade-in slide-in-from-right-2 duration-200">
        <button 
          disabled={isDeleting}
          onClick={() => setShowConfirm(false)}
          className="px-3 py-1.5 rounded-lg bg-zinc-800 text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button 
          disabled={isDeleting}
          onClick={handleDelete}
          className="px-3 py-1.5 rounded-lg bg-red-500 text-[10px] font-black text-white uppercase tracking-widest hover:bg-red-600 transition-colors flex items-center shadow-lg shadow-red-500/20"
        >
          {isDeleting ? <Loader2 className="animate-spin" size={12} /> : "Confirm Delete"}
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => setShowConfirm(true)}
      className="p-2.5 rounded-xl bg-zinc-800/50 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-all group scale-90 hover:scale-100"
      title={`Delete ${userName}`}
    >
      <Trash2 size={16} />
    </button>
  );
}
