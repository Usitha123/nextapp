"use client";  // Marks this component as a Client Component

import { useEffect } from "react";

const ClearCookies = () => {
  useEffect(() => {
    const handleTabClose = () => {
      // Delete the session cookie when the tab/window is closed
      document.cookie = "__Secure-next-auth.session-token=; Max-Age=0; path=/";
      // Optionally clear other cookies if necessary
    };

    // Add event listener for the tab/window being closed
    window.addEventListener("beforeunload", handleTabClose);

    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, []);

  return null;  // This component doesn't render anything
};

export default ClearCookies;
