// Query all Project nodes
MATCH (p:Project)
RETURN p
ORDER BY p.name;