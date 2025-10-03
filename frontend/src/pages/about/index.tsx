import AboutArea from "../../components/about-area"
import BlogArea from "../../components/blog-area"
import BreadcrumbArea from "../../components/breadcrumb-area"
import FeatureArea from "../../components/feature-area"
import NewsLaterArea from "../../components/newslater-area"
import SkillArea from "../../components/skill-area"

const AboutPage = () => {
  return (
    <>
      <BreadcrumbArea title="About Us" tag="about" />
      <AboutArea />
      <SkillArea />
      <FeatureArea />
      <BlogArea />
      <NewsLaterArea />
    </>
  )
}

export default AboutPage