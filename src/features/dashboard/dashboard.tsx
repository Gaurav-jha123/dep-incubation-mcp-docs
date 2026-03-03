
import SkillMatrixTable from "./components/SkillMatrixTable"
import skillMatrix from "./../../mocks/skillMatrix"

const Dashboard = () => {
  return (
    <div><SkillMatrixTable data={skillMatrix} /></div>
  )
}

export default Dashboard