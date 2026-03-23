"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TicketCategory, TicketStatus } from "@prisma/client";
import { sendEmail } from "@/lib/email";

export async function createSupportTicket(data: {
  userId: string;
  subject: string;
  message: string;
  category: TicketCategory;
}) {
  try {
    // Generate a unique Ticket ID: PF-RANDOM
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const ticketId = `PF-${randomStr}`;

    const ticket = await prisma.supportTicket.create({
      data: {
        ticketId,
        userId: data.userId,
        subject: data.subject,
        message: data.message,
        category: data.category,
        status: TicketStatus.OPEN,
      },
      include: {
        user: true
      }
    });

    // Send Email Notification
    if (ticket.user?.email) {
      await sendEmail(
        ticket.user.email,
        `Dispute Registered: ${ticketId}`,
        `
          <div style="font-family: sans-serif; padding: 20px; color: #0F172A;">
            <h1 style="font-weight: 800; text-transform: uppercase; letter-spacing: -0.05em;">PassFit Support</h1>
            <p style="font-size: 14px; font-weight: 500;">Your dispute has been registered successfully.</p>
            <div style="background: #F8FAFC; padding: 20px; border-radius: 12px; margin: 20px 0;">
              <p style="margin: 0; font-size: 10px; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 0.1em;">Ticket ID</p>
              <h2 style="margin: 5px 0 0 0; color: #10B981;">${ticketId}</h2>
              <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 15px 0;">
              <p style="margin: 0; font-size: 10px; font-weight: 800; color: #64748B; text-transform: uppercase;">Subject</p>
              <p style="margin: 5px 0 0 0; font-weight: 600;">${data.subject}</p>
            </div>
            <p style="font-size: 12px; color: #64748B;">Our team will review your dispute and get back to you within 24-48 hours. You can track this ticket in your profile.</p>
          </div>
        `
      );
    }

    revalidatePath("/profile");
    return { success: true, ticketId };
  } catch (error: any) {
    console.error("Support Ticket Error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateTicketStatus(ticketId: string, status: TicketStatus) {
  try {
    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status }
    });
    revalidatePath("/admin/support");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
