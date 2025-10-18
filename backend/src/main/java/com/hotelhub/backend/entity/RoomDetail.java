package com.hotelhub.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "room_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomDetail {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "detail_id")
    private Long detailId;
    
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;
    
    @Column(name = "bed_type", length = 50)
    private String bedType;
    
    @Column(name = "room_size")
    private Double roomSize;
    
    @Column(name = "floor")
    private Integer floor;
    
    @Column(name = "view_type", length = 50)
    private String viewType;
    
    @Column(name = "smoking_allowed")
    private Boolean smokingAllowed = false;
    
    @Column(name = "pet_friendly")
    private Boolean petFriendly = false;
    
    @Column(name = "wifi_speed")
    private String wifiSpeed;
    
    @Column(name = "air_conditioning")
    private Boolean airConditioning = true;
    
    @Column(name = "minibar")
    private Boolean minibar = false;
    
    @Column(name = "balcony")
    private Boolean balcony = false;
    
    @Column(name = "ocean_view")
    private Boolean oceanView = false;
}