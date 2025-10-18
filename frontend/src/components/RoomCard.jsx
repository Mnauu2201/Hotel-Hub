import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faWifi, 
  faSnowflake, 
  faWineBottle, 
  faUmbrellaBeach, 
  faWater, 
  faPaw, 
  faSmokingBan, 
  faCheckCircle,
  faShieldAlt,
  faConciergeBell,
  faDumbbell,
  faTv,
  faSwimmingPool,
  faSpa,
  faUtensils,
  faParking,
  faTshirt,
  faBriefcase,
  faCoffee
} from '@fortawesome/free-solid-svg-icons'

const RoomCard = ({ room, onBook }) => {
  return (
    <div style={{
      border: '1px solid #eee',
      borderRadius: 12,
      padding: '1rem',
      margin: '0.5rem',
      backgroundColor: 'white',
      boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
      height: '100%',
      minHeight: 480,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>
        Số phòng {room.roomNumber || room.room_number}
      </h3>
      <div style={{ flexGrow: 1 }}>
        <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
          Loại phòng: {room.roomTypeName || room.type || room.roomType?.name || 'N/A'}
        </p>
        <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
          Sức chứa: {room.capacity} người
        </p>
        {room.roomDetail && (
          <div style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
            {room.roomDetail.bedType && (
              <div>Giường: {room.roomDetail.bedType}</div>
            )}
            {room.roomDetail.roomSize && (
              <div>Diện tích: {room.roomDetail.roomSize} m²</div>
            )}
            {room.roomDetail.viewType && (
              <div>Tầm nhìn: {room.roomDetail.viewType}</div>
            )}
          </div>
        )}
        <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
          Mô tả: {room.description}
        </p>
        {/* Clamp description to 3 lines for equal height */}
        <div style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          color: '#6b7280',
          marginBottom: '0.5rem'
        }}>
          {room.description}
        </div>
        {/* Room Details Amenities */}
        {room.roomDetail && (
          <div style={{ margin: '0 0 0.5rem 0' }}>
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              {room.roomDetail.wifiSpeed && (
                <div title="WiFi" style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px',
                  border: '1px solid #e9ecef',
                  transition: 'all 0.2s ease'
                }}>
                  <FontAwesomeIcon icon={faWifi} style={{ fontSize: '16px', color: '#644222' }} />
                </div>
              )}
              {room.roomDetail.airConditioning && (
                <div title="Air Conditioning" style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px',
                  border: '1px solid #e9ecef',
                  transition: 'all 0.2s ease'
                }}>
                  <FontAwesomeIcon icon={faSnowflake} style={{ fontSize: '16px', color: '#644222' }} />
                </div>
              )}
              {room.roomDetail.minibar && (
                <div title="Minibar" style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px',
                  border: '1px solid #e9ecef',
                  transition: 'all 0.2s ease'
                }}>
                  <FontAwesomeIcon icon={faWineBottle} style={{ fontSize: '16px', color: '#644222' }} />
                </div>
              )}
              {room.roomDetail.balcony && (
                <div title="Balcony" style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px',
                  border: '1px solid #e9ecef',
                  transition: 'all 0.2s ease'
                }}>
                  <FontAwesomeIcon icon={faUmbrellaBeach} style={{ fontSize: '16px', color: '#644222' }} />
                </div>
              )}
              {room.roomDetail.oceanView && (
                <div title="Ocean View" style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px',
                  border: '1px solid #e9ecef',
                  transition: 'all 0.2s ease'
                }}>
                  <FontAwesomeIcon icon={faWater} style={{ fontSize: '16px', color: '#644222' }} />
                </div>
              )}
              {room.roomDetail.petFriendly && (
                <div title="Pet Friendly" style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px',
                  border: '1px solid #e9ecef',
                  transition: 'all 0.2s ease'
                }}>
                  <FontAwesomeIcon icon={faPaw} style={{ fontSize: '16px', color: '#644222' }} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional Amenities from Database */}
        {Array.isArray(room.amenities) && room.amenities.length > 0 && (
          <div style={{ margin: '0 0 0.5rem 0' }}>
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              {room.amenities.slice(0, 8).map((amenity) => {
                // Function to get appropriate icon based on amenity name
                const getAmenityIcon = (name) => {
                  const lowerName = (name || '').toLowerCase();
                  if (lowerName.includes('wifi') || lowerName.includes('internet')) return faWifi;
                  if (lowerName.includes('tv') || lowerName.includes('television')) return faTv;
                  if (lowerName.includes('air') || lowerName.includes('conditioning') || lowerName.includes('điều hòa')) return faSnowflake;
                  if (lowerName.includes('safe') || lowerName.includes('security')) return faShieldAlt;
                  if (lowerName.includes('minibar') || lowerName.includes('mini bar')) return faWineBottle;
                  if (lowerName.includes('balcony') || lowerName.includes('terrace') || lowerName.includes('ban công')) return faUmbrellaBeach;
                  if (lowerName.includes('ocean') || lowerName.includes('sea') || lowerName.includes('view') || lowerName.includes('biển')) return faWater;
                  if (lowerName.includes('pet') || lowerName.includes('animal') || lowerName.includes('thú cưng')) return faPaw;
                  if (lowerName.includes('room service') || lowerName.includes('service')) return faConciergeBell;
                  if (lowerName.includes('gym') || lowerName.includes('fitness') || lowerName.includes('exercise')) return faDumbbell;
                  if (lowerName.includes('pool') || lowerName.includes('swimming')) return faSwimmingPool;
                  if (lowerName.includes('spa') || lowerName.includes('wellness')) return faSpa;
                  if (lowerName.includes('restaurant') || lowerName.includes('dining')) return faUtensils;
                  if (lowerName.includes('parking') || lowerName.includes('car')) return faParking;
                  if (lowerName.includes('laundry') || lowerName.includes('cleaning')) return faTshirt;
                  if (lowerName.includes('business') || lowerName.includes('office')) return faBriefcase;
                  if (lowerName.includes('concierge') || lowerName.includes('assistance')) return faConciergeBell;
                  if (lowerName.includes('breakfast') || lowerName.includes('meal')) return faCoffee;
                  if (lowerName.includes('housekeeping') || lowerName.includes('cleaning')) return faTshirt;
                  if (lowerName.includes('smoking') || lowerName.includes('hút thuốc')) return faSmokingBan;
                  return faCheckCircle; // Default icon
                };

                return (
                  <div 
                    key={amenity.amenityId || amenity.name} 
                    title={amenity.name}
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '6px',
                      border: '1px solid #e9ecef',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#644222';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                      e.currentTarget.style.color = '#644222';
                    }}
                  >
                    <FontAwesomeIcon 
                      icon={getAmenityIcon(amenity.name)} 
                      style={{ 
                        fontSize: '16px',
                        color: '#644222'
                      }} 
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#8a643f' }}>
          {(room.price?.toLocaleString?.() || room.price)?.toString()} VNĐ/đêm
        </span>
        <button
          onClick={() => onBook(room)}
          style={{
            backgroundColor: '#644222',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: 8,
            cursor: 'pointer'
          }}
        >
          Đặt phòng
        </button>
      </div>
    </div>
  );
};

export default RoomCard;