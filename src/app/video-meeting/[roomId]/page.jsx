"use client";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const VideoMeeting = () => {
    const { data: session, status } = useSession();
    const params = useParams();
    const roomId = params.roomId;
    const router = useRouter();

    // ref for video container
    const containerRef = useRef(null);
    const [zp, setZp] = useState(null);
    const [isInMeeting, setIsInMeeting] = useState(false);

    useEffect(() => {
        if (
            status === "authenticated" &&
            session?.user?.name &&
            containerRef.current
        ) {
            // console.log("session is authenticated meeting joining");
            myMeeting(containerRef.current);
        } else {
            console.log("Session is not authenticate, please login before use");
            // toast.error("session is not authenticate, please login before use");
        }
    }, [session, status]);
    // FOR VIDEO

    useEffect(() => {
        return () => {
            if (zp) {
                zp.destroy()
            }
        }
    }, [zp])


    let myMeeting = async (element) => {
        // generate Kit Token
        const appID = Number(process.env.NEXT_PUBLIC_ZEGOAPP_ID);
        const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;
        if (!appID && !serverSecret) {
            throw new Error("Please provide App ID and Secret Key");
        }
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            roomId,
            session?.user?.id || Date.now().toString(),
            session?.user?.name || "Guest"
        );

        // Create instance object from Kit Token.
        const zegoInstance = ZegoUIKitPrebuilt.create(kitToken);
        setZp(zegoInstance);
        // start the call
        zegoInstance.joinRoom({
            container: element,
            sharedLinks: [
                {
                    name: "Join via this link",
                    url: `${window?.location?.origin}/video-meeting/${roomId}`

                },
            ],
            scenario: {
                mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
            },
            showAudioVideoSettingsButton: true,
            showScreenSharingButton: true,
            showTurnOffRemoteCameraButton: true,
            showTurnOffRemoteMicrophoneButton: true,
            showRemoveUserButton: true,
            onJoinRoom: () => {
                toast.success('Meeting join successfully');
                setIsInMeeting(true);
            },
            onLeaveRoom: () => {
                endMeeting();
            }

        });
    };
    const endMeeting = () => {
        if (zp) {
            zp.destroy()
        }
        toast.success("Meeting end succesfully")
        setZp(null);
        setIsInMeeting(false)
        router.push('/')
    }
    return (
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className={`flex flex-col flex-grow lg:flex-row md:flex-row relative ${isInMeeting ? 'h-screen' : ''}`}>
                <div ref={containerRef} className="video-container flex-grow" style={{ height: isInMeeting ? "100%" : "calc(100vh-4rem" }}>

                </div>
            </div>

            {!isInMeeting && (
                <div className="flex flex-col">
                    <div className="p-6 ">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                            Meeting Info
                        </h2>
                        <p className="text-sm mb-4 text-gray-600 dark:text-gray-300">Participant -{session?.user?.name}</p>
                        <Button onClick={endMeeting} className="w-full bg-red-500 hover:bg-red-200 text-white hover:text-black">
                            End Meeting
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 p-6 bg-gray-200 dark:bg-gray-800">
                        <div className="text-center">
                            <Image src='/images/videoQuality.jpg' alt="feature_1"
                                width={150} height={150} className="mx-auto mb-2 rounded-full" />
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">HD Video Quality</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Experience crystal clear video calls</p>
                        </div>

                        <div className="text-center">
                            <Image src='/images/screenShare.jpg' alt="feature_1"
                                width={150} height={150} className="mx-auto mb-2 rounded-full" />
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Screen Sharing</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Easily share your screen with your team members</p>
                        </div>

                        <div className="text-center">
                            <Image src='/images/videoSecure.jpg' alt="feature_1"
                                width={150} height={150} className="mx-auto mb-2 rounded-full" />
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Secure Meetings</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Your Meetings are protected and private</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoMeeting;
