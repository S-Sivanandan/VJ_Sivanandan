/*
# Create friction_points table

## Purpose
Persists operator-submitted friction points (strategy forum submissions) for the
Visionary Journal Cognitive Lab. Each submission is a described system friction or
failure that the operator wants strategic refinement on.

## New Tables

### friction_points
- `id` (uuid, primary key) — auto-generated identifier
- `user_id` (uuid, not null, default auth.uid()) — links to the authenticated operator;
  defaults to the session user so the client never needs to supply it explicitly
- `content` (text, not null) — the friction/issue description submitted by the operator
- `status` (text, not null, default 'pending') — lifecycle state: 'pending' | 'resolved'
- `refinement` (text, nullable) — strategic refinement response, added after review
- `created_at` (timestamptz, default now()) — submission timestamp

## Security

- RLS enabled. All four CRUD policies are scoped to the authenticated user's own rows
  via `auth.uid() = user_id`.
- Only authenticated sessions can read or write. Anonymous access is denied.

## Notes

1. The `DEFAULT auth.uid()` on `user_id` means `.insert({ content })` (without
   passing `user_id`) satisfies the INSERT policy's `WITH CHECK (auth.uid() = user_id)`.
2. The `status` column uses a check constraint to prevent invalid state values.
3. An index on `(user_id, created_at DESC)` supports the default feed query order.
*/

CREATE TABLE IF NOT EXISTS friction_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved')),
  refinement text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS friction_points_user_created
  ON friction_points (user_id, created_at DESC);

ALTER TABLE friction_points ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_friction_points" ON friction_points;
CREATE POLICY "select_own_friction_points" ON friction_points FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_friction_points" ON friction_points;
CREATE POLICY "insert_own_friction_points" ON friction_points FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_friction_points" ON friction_points;
CREATE POLICY "update_own_friction_points" ON friction_points FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_friction_points" ON friction_points;
CREATE POLICY "delete_own_friction_points" ON friction_points FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
