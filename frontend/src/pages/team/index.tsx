import BreadcrumbArea from "../../components/breadcrumb-area"
import NewsLaterArea from "../../components/newslater-area"
import SkillArea from "../../components/skill-area"
import TeamArea2 from "../../components/team-area/index2"

const TeamPage = () => {
  return (
    <>
      <BreadcrumbArea title="Team" tag="Team" />
      <TeamArea2 />
      <SkillArea />
      <NewsLaterArea/>
    </>
  )
}

export default TeamPage