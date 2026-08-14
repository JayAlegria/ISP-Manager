import Image from "next/image"
import { LoginForm } from "@/components/login-form"
import { login } from "@/actions/auth/login"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function page() {

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <Avatar size="lg">
              <AvatarImage src={"/assets/avatar.png"} />
              <AvatarFallback>My Profile</AvatarFallback>
            </Avatar>
            HI TECHY
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm action={login} />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image src={"/assets/login.jpg"} fill sizes="fill" alt="login" />
      </div>
    </div>
  )
}
