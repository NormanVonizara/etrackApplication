import Navbar from "@/app/components/Navbar";

interface Props {
    children: React.ReactNode
}

export function Wrapper ({children}: Props) {
    return(
        <div>
            <Navbar/>
            <div className="px-5 md:px-[10%] mt-10 mb-10">
                {children}
            </div>
        </div>
    )
}