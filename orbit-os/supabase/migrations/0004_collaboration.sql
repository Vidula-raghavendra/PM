-- ---------------------------------------------------------------------------
-- 1. Add status column to collaborators
-- ---------------------------------------------------------------------------

ALTER TABLE public.collaborators
  ADD COLUMN status text NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED'));

UPDATE public.collaborators SET status = 'ACCEPTED' WHERE user_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.link_pending_collaborators()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.collaborators
     SET user_id = new.id,
         status  = 'ACCEPTED'
   WHERE user_id IS NULL
     AND lower(email) = lower(new.email);
  RETURN new;
END;
$$;

-- ---------------------------------------------------------------------------
-- 2. Notifications table
-- ---------------------------------------------------------------------------

CREATE TABLE public.notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  type        text NOT NULL CHECK (type IN ('INVITATION', 'MEETING', 'GENERAL')),
  title       text NOT NULL,
  body        text,
  link        text,
  is_read     boolean NOT NULL DEFAULT false,
  metadata    jsonb DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_id ON public.notifications (user_id);
CREATE INDEX idx_notifications_unread  ON public.notifications (user_id) WHERE NOT is_read;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can read own notifications"
  ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "users can update own notifications"
  ON public.notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "users can delete own notifications"
  ON public.notifications FOR DELETE USING (user_id = auth.uid());
CREATE POLICY "authenticated users can insert notifications"
  ON public.notifications FOR INSERT WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 3. Add meeting_link to calendar_events
-- ---------------------------------------------------------------------------

ALTER TABLE public.calendar_events
  ADD COLUMN meeting_link text;

-- ---------------------------------------------------------------------------
-- 4. Meeting attendees table
-- ---------------------------------------------------------------------------

CREATE TABLE public.meeting_attendees (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   uuid NOT NULL REFERENCES public.calendar_events (id) ON DELETE CASCADE,
  user_id    uuid REFERENCES public.profiles (id) ON DELETE CASCADE,
  email      text NOT NULL,
  status     text NOT NULL DEFAULT 'INVITED'
               CHECK (status IN ('INVITED', 'ACCEPTED', 'DECLINED')),
  UNIQUE (event_id, email)
);

CREATE INDEX idx_meeting_attendees_event ON public.meeting_attendees (event_id);
CREATE INDEX idx_meeting_attendees_user  ON public.meeting_attendees (user_id);

ALTER TABLE public.meeting_attendees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "attendees can read own meetings"
  ON public.meeting_attendees FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.calendar_events e
      WHERE e.id = event_id AND e.user_id = auth.uid()
    )
  );

CREATE POLICY "event creators can insert attendees"
  ON public.meeting_attendees FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.calendar_events e
      WHERE e.id = event_id AND e.user_id = auth.uid()
    )
  );

CREATE POLICY "event creators can delete attendees"
  ON public.meeting_attendees FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.calendar_events e
      WHERE e.id = event_id AND e.user_id = auth.uid()
    )
  );
