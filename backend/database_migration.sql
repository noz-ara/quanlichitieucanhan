-- Database Migration Script for User-Specific Expenses
-- This script should be run to update existing database structure

-- 1. Add user_id column to expenses table if it doesn't exist
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS user_id BIGINT;

-- 2. Create foreign key constraint
-- Note: This will fail if there are existing expenses without user_id
-- You may need to handle existing data first

-- 3. Update existing expenses to assign them to a default user (if needed)
-- Replace '1' with the actual default user ID you want to assign
-- UPDATE expenses SET user_id = 1 WHERE user_id IS NULL;

-- 4. Make user_id NOT NULL after all expenses have been assigned
-- ALTER TABLE expenses MODIFY COLUMN user_id BIGINT NOT NULL;

-- 5. Add foreign key constraint
-- ALTER TABLE expenses ADD CONSTRAINT fk_expenses_user FOREIGN KEY (user_id) REFERENCES users(id);

-- 6. Create index for better performance
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, date);

-- 7. Optional: Create a view for easier querying
-- CREATE OR REPLACE VIEW user_expenses AS
-- SELECT e.*, u.username, u.email 
-- FROM expenses e 
-- JOIN users u ON e.user_id = u.id;

-- Note: Run these commands step by step and handle any errors appropriately
-- You may need to backup your data before running this migration
