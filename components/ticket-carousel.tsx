"use client";

import { useEffect, useState } from "react";
import { CalendarClock, CreditCard } from "lucide-react";
import QRCode from "qrcode";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TicketRecord } from "@/types/ticket";

type TicketCarouselProps = {
  tickets: TicketRecord[];
};

const purchasedFormatter = new Intl.DateTimeFormat("en-SG", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatAmount(amount: number | null) {
  if (amount === null) return "Amount unavailable";
  return `$${amount.toFixed(2)}`;
}

export default function TicketCarousel({ tickets }: TicketCarouselProps) {
  const [api, setApi] = useState<CarouselApi>(); // embla api
  const [currentIndex, setCurrentIndex] = useState(0);
  const [qrMap, setQrMap] = useState<Record<string, string>>({});

  const totalTickets = tickets.length;
  const currentTicket = tickets[currentIndex];

  // embla api to track current index
  useEffect(() => {
    if (!api) return;

    const handler = () => setCurrentIndex(api.selectedScrollSnap());

    handler();
    api.on("select", handler);
  }, [api]);

  // generate qr code for each ticket
  useEffect(() => {
    async function generateQrCodes() {
      const entries = await Promise.all(
        tickets.map(async (ticket) => {
          try {
            const dataUrl = await QRCode.toDataURL(ticket.ticket_code, {
              margin: 1,
              width: 240,
            });
            return [ticket.id, dataUrl] as const;
          } catch (err) {
            console.error("Failed to generate QR code", err);
            return [ticket.id, ""] as const;
          }
        })
      );
      setQrMap(Object.fromEntries(entries));
    }
    generateQrCodes();
  }, [tickets]);

  // if no ticket, render this component
  if (tickets.length === 0) {
    return (
      <div className="w-full rounded-xl border bg-card/60 p-5 shadow-sm">
        <p className="text-sm text-muted-foreground">
          No tickets found. Buy one now.
        </p>
      </div>
    );
  }

  // else render carousel
  return (
    <div className="w-full overflow-hidden rounded-xl border shadow-sm">
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "center" }}
        className="w-full"
      >
        {/* header */}
        <div className="flex items-center justify-between gap-3 border-b px-5 py-4">
          <div className="flex flex-col gap-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Your tickets
            </p>
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold">
                Ticket {currentIndex + 1} of {totalTickets}
              </span>
              <Badge variant="secondary" className="bg-green-400">
                {currentTicket?.status
                  ? currentTicket?.status.toUpperCase()
                  : "VALID"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Show the QR to get into the event.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CarouselPrevious className="static size-9 translate-x-0 translate-y-0" />
            <CarouselNext className="static size-9 translate-x-0 translate-y-0" />
          </div>
        </div>

        <CarouselContent className="p-6">
          {tickets.map((ticket) => (
            <CarouselItem key={ticket.id}>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr] md:items-center">
                <div className="flex justify-center">
                  <div className="rounded-lg border bg-white p-4 shadow-inner">
                    <img
                      alt={`QR code for ticket ${ticket.ticket_code}`}
                      src={qrMap[ticket.id]}
                      className="h-56 w-56 object-contain"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarClock className="h-4 w-4" />
                      <span>
                        Purchased{" "}
                        {purchasedFormatter.format(new Date(ticket.created_at))}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span>{formatAmount(ticket.amount_paid)}</span>
                    </div>
                  </div>
                  <div className="rounded-md border bg-background px-3 py-2">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Ticket code
                    </p>
                    <p className="font-mono text-sm break-all">
                      {ticket.ticket_code}
                    </p>
                  </div>
                  <div className="rounded-md border bg-background px-3 py-2">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Stripe session
                    </p>
                    <p className="font-mono text-sm break-all">
                      {ticket.stripe_session_id ?? "Not recorded"}
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* bottom dot buttons for UX */}
        <div className="flex items-center justify-center gap-2 border-t px-5 py-3">
          {tickets.map((ticket, idx) => (
            <button
              key={ticket.id}
              onClick={() => api?.scrollTo(idx)}
              aria-label={`View ticket ${idx + 1}`}
              className={cn(
                "h-2.5 w-2.5 rounded-full border transition",
                idx === currentIndex
                  ? "border-foreground bg-foreground"
                  : "border-muted-foreground/30 bg-muted"
              )}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
}
