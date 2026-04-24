// Query all Service nodes
MATCH (s:Service)
RETURN s
ORDER BY s.name;