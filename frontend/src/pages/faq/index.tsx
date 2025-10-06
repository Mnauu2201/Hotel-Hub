import BreadcrumbArea from "../../components/breadcrumb-area"
import FaqArea from "../../components/faq-area"
import NewsLaterArea from "../../components/newslater-area"
import TeamArea from "../../components/team-area"

const FaqPage = () => {
  return (
    <>
      <BreadcrumbArea tag="Faq" title="Faq" />
      <FaqArea />
      <NewsLaterArea />
      <TeamArea />
    </>
  )
}
export default FaqPage