CREATE TABLE highlight_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id text NOT NULL,
  article_title text NOT NULL,
  quote text NOT NULL,
  note text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE highlight_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_highlights" ON highlight_notes FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_highlights" ON highlight_notes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_highlights" ON highlight_notes FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_highlights" ON highlight_notes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
