

import Lottie from "lottie-react";
import skillMatrixLottie from "@/assets/lottie/skill-matrix-lottie.json";

const SkillMatrixLottie = () => {
    return  <Lottie className="hidden lg:block w-1/2" animationData={skillMatrixLottie} loop={true} />
}

export default SkillMatrixLottie