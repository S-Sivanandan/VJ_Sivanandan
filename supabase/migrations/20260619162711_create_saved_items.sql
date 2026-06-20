CREATE TABLE saved_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type text NOT NULL CHECK (item_type IN ('record', 'sheet')),
  item_id text NOT NULL,
  item_title text NOT NULL,
  item_meta jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_type, item_id)
);

ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_saved" ON saved_items FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_saved" ON saved_items FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_saved" ON saved_items FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_saved" ON saved_items FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
