export const version = 3;
export const name = 'add_favorites_table';
export const description = 'Add table to track user favorite projects';

export const up = `
CREATE TABLE IF NOT EXISTS favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  project_id INTEGER NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  UNIQUE(user_id, project_id)
);
`;

export const down = `
DROP TABLE IF EXISTS favorites;
`;
