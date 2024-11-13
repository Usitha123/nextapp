import LoginForm from "@/components/LoginForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";
import StoreContextProvider from "./context/StoreContext";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) redirect("/UserView");

  return (
    <StoreContextProvider>
      <main>
      <LoginForm />
    </main>
    </StoreContextProvider>
    // <StoreContextProvider>
    //         <FoodDisplay category="someCategory" />
    // </StoreContextProvider>
  );
}
