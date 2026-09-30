-- Enable Supabase Realtime on bank payment submissions for portal/admin live updates

do $$
begin
  alter publication supabase_realtime add table bank_payment_submissions;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;
