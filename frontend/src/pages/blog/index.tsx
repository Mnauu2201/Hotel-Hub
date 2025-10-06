import BreadcrumbArea from "../../components/breadcrumb-area"
import InnerBlog from "../../components/inner-blog"
import SearchPopup from "../../components/search-popup"

const BlogPage = () => {
  return (
    <>
      <SearchPopup />
      <BreadcrumbArea tag="Blog" title="Blog" />
      <InnerBlog />
    </>
  )
}
export default BlogPage