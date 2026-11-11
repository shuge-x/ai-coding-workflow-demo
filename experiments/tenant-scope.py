"""Isolated counterexample, not application code or an authentication system."""
import sqlite3

connection = sqlite3.connect(":memory:")
connection.execute("PRAGMA foreign_keys = ON")
connection.executescript("""
CREATE TABLE project (id TEXT, tenant_id TEXT, PRIMARY KEY (tenant_id, id));
CREATE TABLE task (id TEXT PRIMARY KEY, project_id TEXT, tenant_id TEXT, title TEXT,
  FOREIGN KEY (tenant_id, project_id) REFERENCES project (tenant_id, id));
INSERT INTO project VALUES ('project-a', 'team-a'), ('project-b', 'team-b');
INSERT INTO task VALUES ('task-a', 'project-a', 'team-a', 'A only'), ('task-b', 'project-b', 'team-b', 'B only');
""")
# An id alone leaks team B's task while the request is scoped to team A.
unscoped = connection.execute("SELECT title FROM task WHERE id = ?", ("task-b",)).fetchone()
assert unscoped == ("B only",)
scoped = connection.execute("SELECT title FROM task WHERE id = ? AND tenant_id = ?", ("task-b", "team-a")).fetchone()
assert scoped is None
assert connection.execute("SELECT title FROM task WHERE id = ? AND tenant_id = ?", ("task-a", "team-a")).fetchone() == ("A only",)
# A composite FK rejects a task claiming A while referencing B's project.
try:
    connection.execute("INSERT INTO task VALUES ('forged', 'project-b', 'team-a', 'invalid')")
except sqlite3.IntegrityError:
    pass
else:
    raise AssertionError("Cross-tenant relationship was accepted")
print("PASS: unscoped read leaks; scoped read denies; same-tenant read works; composite FK rejects forged ownership.")
print("LIMIT: request tenant identity is a fixture; current application, PostgreSQL RLS, migrations and production authentication are NOT verified.")
connection.close()
