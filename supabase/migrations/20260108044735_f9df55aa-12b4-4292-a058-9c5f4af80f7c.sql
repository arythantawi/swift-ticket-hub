-- Add policies for schedule management (temporary - no auth)
-- In production, these should be restricted to admin users only

CREATE POLICY "Allow all to read schedules"
ON public.schedules
FOR SELECT
USING (true);

-- Drop the previous restrictive select policy
DROP POLICY IF EXISTS "Anyone can view active schedules" ON public.schedules;

CREATE POLICY "Allow insert schedules"
ON public.schedules
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow update schedules"
ON public.schedules
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow delete schedules"
ON public.schedules
FOR DELETE
USING (true);