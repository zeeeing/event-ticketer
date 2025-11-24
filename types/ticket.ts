export type TicketRecord = {
  id: string;
  created_at: string;
  user_id: string;
  stripe_session_id: string | null;
  amount_paid: number | null;
  ticket_code: string;
  status: string | null;
};
