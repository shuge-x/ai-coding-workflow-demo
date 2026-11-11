import { cookies } from "next/headers";

export const demoActors = ["user-lin", "user-chen", "user-zhou"] as const;
export async function getDemoActor() {
  const value = (await cookies()).get("demo-actor")?.value;
  return demoActors.find((id) => id === value) ?? "user-lin";
}
