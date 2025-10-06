import BreadcrumbArea from "../../components/breadcrumb-area"
import InnerBlog2 from "../../components/inner-blog/index2"
import SearchPopup from "../../components/search-popup"

const BlogDetail = () => {
  return (
    <>
      <SearchPopup />
      <BreadcrumbArea title="Blog Details" tag="Blog Details" />
      <InnerBlog2/>
    </>
  )
}
export default BlogDetail