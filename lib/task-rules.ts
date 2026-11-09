export function canAssignTask(actorRole: string | undefined, assigneeIsProjectMember: boolean) {
  return (actorRole === "OWNER" || actorRole === "MANAGER") && assigneeIsProjectMember;
}
