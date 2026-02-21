-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and update their own profile.
-- Insert is handled by service role in signup, so no public insert policy needed usually, 
-- but if we want to allow it:
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Projects: 
-- 1. Owner can do everything.
-- 2. Collaborators can view and maybe update (depending on business logic).
--    Refactoring: "collaborators" is a many-to-many table? Or jsonb? 
--    Assuming 'collaborators' table linking project_id and user_id.

CREATE POLICY "Users can view projects they own" ON projects FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can update projects they own" ON projects FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete projects they own" ON projects FOR DELETE USING (auth.uid() = owner_id);
CREATE POLICY "Users can insert projects" ON projects FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Collaborator access (View only?)
CREATE POLICY "Collaborators can view projects" ON projects FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM collaborators 
    WHERE collaborators.project_id = projects.id 
    AND collaborators.user_id = auth.uid()
  )
);

-- Tasks, Milestones, Documents, TimeLogs, Goals, Events
-- Usually inherit access from Project OR user_id.

-- Goals/Calendar Events (Direct user ownership)
CREATE POLICY "Users can manage their own goals" ON goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own calendar events" ON calendar_events FOR ALL USING (auth.uid() = user_id);

-- Payments (User specific or Linked to Project?)
-- Assuming payments are linked to user directly for now, or via project.
-- If payments have 'user_id':
CREATE POLICY "Users can view their own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
-- If payments are inserted by system/webhooks, maybe no insert policy for users, or:
-- CREATE POLICY "Users can insert payments" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Audit Logs (View only for own logs)
CREATE POLICY "Users can view their own audit logs" ON audit_logs FOR SELECT USING (auth.uid() = user_id);

-- Project sub-resources (Tasks, Milestones)
-- Access if user owns project OR is collaborator.
-- Simplification: Check if user is owner of project via join? 
-- Supabase RLS with joins can be performance heavy but correct.

-- Tasks
CREATE POLICY "Users can view tasks of accessible projects" ON tasks FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = tasks.project_id 
    AND (
      projects.owner_id = auth.uid() 
      OR EXISTS (SELECT 1 FROM collaborators c WHERE c.project_id = projects.id AND c.user_id = auth.uid())
    )
  )
);

-- Simple Insert for Tasks (must be owner or collaborator?)
-- A simpler approach for the MVP: Just check project ownership for mutation.
CREATE POLICY "Owners can manage tasks" ON tasks FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = tasks.project_id AND projects.owner_id = auth.uid())
);

-- Repeat for Milestones
CREATE POLICY "Owners can manage milestones" ON milestones FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = milestones.project_id AND projects.owner_id = auth.uid())
);

-- Time Logs (User specific)
CREATE POLICY "Users can manage their own time logs" ON time_logs FOR ALL USING (auth.uid() = user_id);

