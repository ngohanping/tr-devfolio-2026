Graph Schema
Nodes
Team: Team — properties: name (string).
Project: Project — properties: name (string).
Service: Service — properties: name (string), type (string) — e.g. aws_lambda, api-gateway, external_service, aws dynamodb.
Relationships
OWNS: (:Team)-[:OWNS]->(:Project) — team owns a project (one-to-many from team → projects; projects can be owned by multiple teams if modeled so).
DEPLOYED_ON: (:Project)-[:DEPLOYED_ON]->(:Service) — project deployed to a service (e.g., lambda).
CALLS: (:Service)-[:CALLS]->(:Service) — service-to-service call.
EXPOSED_BY: (:Service)-[:EXPOSED_BY]->(:Service) — a service is exposed by another (e.g., lambda EXPOSED_BY api-gateway).
