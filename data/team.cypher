// Query all Team nodes
MATCH (t:Team)
RETURN t
ORDER BY t.name;