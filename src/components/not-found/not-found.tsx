import Lottie from "lottie-react"
import NotFoundLottie from '@/assets/lottie/not-found.json'

const NotFound = () => {
  return (
    <main className="flex justify-center items-center w-full h-full bg-white">
      <Lottie className="max-w-lg" animationData={NotFoundLottie}/>
  </main>
  )
}

export default NotFound