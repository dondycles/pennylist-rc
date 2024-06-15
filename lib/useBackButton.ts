import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export const useBackButtonHandler = () => {
  const router = useRouter();
  const [exitApp, setExitApp] = useState(false);

  useEffect(() => {
    const handleBackButton = (event: any) => {
      if (exitApp) {
        // Allow the default back action to proceed
        router.back();
      } else {
        // Prevent the default action and show a confirmation
        event.preventDefault();
        setExitApp(true);
        alert("Press back again to exit");

        // Reset the exitApp flag after 2 seconds
        setTimeout(() => setExitApp(false), 2000);
      }
    };

    window.addEventListener("popstate", handleBackButton);
    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [exitApp, router]);
};
