import { TickCircle } from "iconsax-react";
import Image from "next/image";
import Router from "next/router";

function Users({ user }) {

    return (
        <div
            className="flex group cursor-pointer flex-col items-center transition-all hover:-translate-y-1 transform justify-center rounded-2xl overflow-hidden bg-white/10 hover:bg-white/20 border-[1px] border-white/10"
            onClick={() =>
                Router.push(`/profile/${user?._id}`)
            }
        >
            <Image src={user?.banner ?? "/dummyBanner.png"} alt="avt" width={500} height={500} className="h-24 object-cover bg-white w-full group-hover:scale-125 transition-all" />
            <div className="-mt-10 w-16 h-16 rounded-full overflow-hidden border-2 border-gray-400 ">
                <Image src={user?.profilePic ?? "/dummyAvatar.png"} alt="avt" width={200} height={200} className="object-cover h-[100%] group-hover:scale-125 transform transition-all " />
            </div>
            <div className="px-4 pb-4 w-full flex flex-col items-center justify-center" >
                <div className="mt-4 flex flex-row items-center justify-center">
                    <p className="text-xl font-bold">{user?.displayName}</p>
                    {user?.isVerified &&
                        <TickCircle className="ml-1 textClip" variant="Bold" />}
                </div>
                <p className="text-sm mt-2 truncate-2 text-center" > {user?.shortBio}</p>
            </div>
        </div>
    );
}

export default Users;
