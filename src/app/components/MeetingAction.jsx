"use client";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Copy, Link2, LinkIcon, Plus, Video } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { uid } from 'uid';

const MeetingAction = () => {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [isDialog, setIsDialog] = useState(false)
  const [generatetedMeetingUrl, setGeneratetedMeetingUrl] = useState("")
  const [baseUrl, setBaseUrl] = useState("")
  const [meetingLink, setMeetingLink] = useState("")
  const router = useRouter()

  useEffect(() => {
    setBaseUrl(window?.location?.origin)
  }, [])

  const handleCreateMeetingForLater = () => {
    const roomId = uid()
    console.log(roomId)
    const url = `${baseUrl}/video-meeting/${roomId}`
    setGeneratetedMeetingUrl(url)
    setIsDialog(true);
    toast.success("Meeting link created successfully")
  }

  const handleJoinMeetingLink = () => {
    if (meetingLink) {
      setIsLoading(true);
      const formattedLink = meetingLink.includes("http") ? meetingLink : `${baseUrl}/video-meeting/${meetingLink}`
      router.push(formattedLink)
      toast.info('Joining meeting...')
    } else {
      toast.error('Please Enter Valid link or code!')
    }
  }

  const handleStartMeeting = () => {
    setIsLoading(true);
    const roomId = uid()
    const meetUrl = `${baseUrl}/video-meeting/${roomId}`
    router.push(meetUrl)
    toast.info('Joining meeting...')
  }
  const copyToClipBoard = () => {
    navigator.clipboard.writeText(generatetedMeetingUrl)
    toast.info('Meeting link copied to clipboard')
  }
  return (
    <>
      <div className='flex flex-col md:flex-row lg:flex-row space-y-5 md:space-y-0 lg:space-y-0 md:space-x-8 lg:space-x-8  '>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full sm:w-auto" size="lg">
              <Video className='w-5 h-5 mr-2' />
              New Meeting
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleCreateMeetingForLater}>
              <Link2 className='w-4 h-4 mr-2 ' />
              Create a Link for later
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleStartMeeting}>
              <Plus className='w-4 h-4 mr-2 ' />
              Start an instant meeting
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className='flex w-full sm:w-auto relative'>
          <span className='absolute left-2 top-1/2 transform -translate-y-1/2'>
            <LinkIcon className='w-4 h-4 text-gray-400' />
          </span>
          <Input placeholder="Enter a code or link"
            className="pl-8 rounded-r-none pr-10 "
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)} />
          <Button variant="secondary" className="rounded-l-none " onClick={handleJoinMeetingLink}>
            Join
          </Button>
        </div>
      </div>
      <Dialog open={isDialog} onOpenChange={setIsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-3xl font-normal">
              Here's your joining information
            </DialogTitle>
          </DialogHeader>
          <div className='flex flex-col space-y-4'>
            <p className='text-sm text-gray-600 dark:text-gray-300'>
              Send this to people that you want to meet with. Make sure that you save it so that you can use it later, too.
            </p>
            <div className='flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-lg'>
              <span className='text-gray-700 dark:text-gray-200 break-all'>
                {generatetedMeetingUrl.slice(0, 30)}...
              </span>
              <Button variant="ghost" className="hover:bg-gray-200 " onClick={copyToClipBoard}>
                <Copy className='w-5 h-5 text-orange-500' />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default MeetingAction
