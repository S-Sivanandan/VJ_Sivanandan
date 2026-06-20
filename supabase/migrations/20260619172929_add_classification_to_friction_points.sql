ALTER TABLE friction_points ADD COLUMN IF NOT EXISTS classification text CHECK (classification IN ('decay_spike', 'systemic_friction', 'baseline_failure'));
