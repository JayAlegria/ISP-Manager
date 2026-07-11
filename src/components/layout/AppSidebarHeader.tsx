import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function AppSidebarHeader() {
  return (
    <div className='p-3 flex items-center gap-2'>
        <Avatar size="lg">
          <AvatarImage src={"/assets/avatar.png"}/>
          <AvatarFallback>My Profile</AvatarFallback>
        </Avatar>
        <div className="leading-3">
          <p className="font-bold text-lg">HI TECHY</p>
          <small>The number one internet service provider.</small>
        </div>
    </div>
  )
}
