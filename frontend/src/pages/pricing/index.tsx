import BrandArea from "../../components/brand-area"
import BreadcrumbArea from "../../components/breadcrumb-area"
import PricingArea2 from "../../components/pricing-area/index2"
import TestimonialArea from "../../components/testimonial-area"

const PricingPage = () => {
  return (
    <>
      <BreadcrumbArea title="Pricing" tag="Pricing" />
      <PricingArea2 />
      <TestimonialArea />
      <BrandArea />
    </>
  )
}
export default PricingPage