"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "./components/Loader";
import Header from "./components/Header";
import MeetingAction from "./components/MeetingAction";
import MeetingFeature from "./components/MeetingFeature";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      setIsLoading(false);
      const hasShownWelcome = localStorage.getItem("hasShownWelcome");
      if (!hasShownWelcome) {
        toast.success(`Welcome ${session?.user?.name}!`);
        localStorage.setItem("hasShownWelcome", "true");
      }
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [status, session]);

  if (isLoading) {
    return <Loader />;
  }

  const title= `Empowering Remote Work and Team Collaboration.`
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <main className="flex-grow p-8 pt-32 ">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between ">
            <div className="md:w-1/2 w-full mb-8 md:mb-0">
              <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white capitalize">
                {title}
              </h1>
              <p className="text-3xl text-gray-600 dark:text-gray-300 mb-12">
              Connect seamlessly, collaborate effortlessly, and celebrate your achievements with ease, no matter where you are
              </p>
              <MeetingAction/>
            </div>
            <div className="md:w-1/2 w-full">
              <MeetingFeature/>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
