
import SkillMatrixTable from "./components/SkillMatrixTable"
import skillMatrix from "./../../mocks/skillMatrix"

const Dashboard = () => {
  return (
    <><SkillMatrixTable data={skillMatrix} /></>
  )
}

export default Dashboard