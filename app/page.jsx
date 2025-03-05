import LoginForm from "@/components/LoginForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    // Redirect based on user role
    if (session.user.role === "admin") {
      redirect("/admindashboard");
    } else if (session.user.role === "cashier") {
      redirect("/Cashierdashboard");
    } else if (session.user.role === "canteenOwner") {
      redirect("/Canteendashboard");
    } else {
      redirect("/UserView"); // Default redirect for other roles
    }
  } 

  return (
    <>
      <LoginForm />
    </>
  );
}