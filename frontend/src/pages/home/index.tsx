import AboutArea from "../../components/about-area"
import BlogArea from "../../components/blog-area"
import BookingArea from "../../components/booking-area"
import BookingArea2 from "../../components/booking-area2"
import BrandArea from "../../components/brand-area"
import FeatureArea from "../../components/feature-area"
import PricingArea from "../../components/pricing-area"
import RoomArea from "../../components/room-area"
import ServiceDetails2Area from "../../components/service-details2-area"
import SliderArea from "../../components/slider-area"
import TestimonialArea from "../../components/testimonial-area"

const HomePage = () => {
  return (
    <>
      <SliderArea />
      <BookingArea />
      <AboutArea />
      <ServiceDetails2Area />
      <RoomArea />
      <FeatureArea />
      <PricingArea />
      <TestimonialArea />
      <BookingArea2 />
      <BlogArea />
      <BrandArea />
    </>
  )
}

export default HomePage