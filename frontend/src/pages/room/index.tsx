
import BookingArea2 from "../../components/booking-area2"
import BreadcrumbArea from "../../components/breadcrumb-area"
import FeatureArea from "../../components/feature-area"
import RoomArea2 from "../../components/room-area/index2"

const RoomPage = () => {
  return (
    <>
      <BreadcrumbArea title="Phòng của chúng tôi" tag="Phòng của chúng tôi" />
      <RoomArea2 />
      <FeatureArea />
      <BookingArea2 />
    </>
  )
}

export default RoomPage