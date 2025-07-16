
-- @param {VanType | NULL} $1
-- @param {Int} $2
-- @param {Int} $3
SELECT *, COUNT(*) OVER() AS full_count
FROM "Van"
WHERE ($1 IS NULL OR type = $1::"VanType")
LIMIT $2
OFFSET $3;