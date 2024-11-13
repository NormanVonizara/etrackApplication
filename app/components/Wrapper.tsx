import Navbar from "@/app/components/Navbar";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface Props {
    children: React.ReactNode
}

export function Wrapper ({children}: Props) {
    return(
        <div>
            <ToastContainer
                position="top-center"
                autoClose={8000}
            />
            <Navbar/>
            <div className="px-5 md:px-[10%] mt-10 mb-10">
                {children}
            </div>
        </div>
    )
}