import RegisterForm from "@/app/register/RegisterForm/page";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/config";

export default async function Register() {
 /* const session = await getServerSession(authOptions);

  if (session) redirect("/dashboard");*/

  return <RegisterForm />;
}
