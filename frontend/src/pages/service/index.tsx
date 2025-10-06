import BookingArea2 from "../../components/booking-area2"
import BreadcrumbArea from "../../components/breadcrumb-area"
import FeatureArea from "../../components/feature-area"
import ServiceDetails2Area from "../../components/service-details2-area"
import TestimonialArea from "../../components/testimonial-area"

const ServicePage = () => {
  return (
    <>
      <BreadcrumbArea title="Dịch vụ" tag="Dịch vụ" />
      <ServiceDetails2Area />
      <FeatureArea />
      <BookingArea2 />
      <TestimonialArea/>
    </>
  )
}
export default ServicePage