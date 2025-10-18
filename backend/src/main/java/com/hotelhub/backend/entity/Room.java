package com.hotelhub.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Long roomId;

    @Column(name = "room_number", nullable = false, unique = true, length = 20)
    private String roomNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "type_id", nullable = false)
    private RoomType roomType;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoomStatus status = RoomStatus.AVAILABLE;

    @Column(nullable = false)
    private Integer capacity = 1;

    @Column(columnDefinition = "TEXT")
    @Lob
    private String description;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Quan hệ với room_details
    @OneToOne(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private RoomDetail roomDetail;

    // Quan hệ với room_images
    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RoomImage> images = new ArrayList<>();

    // Quan hệ với amenities (N:M)
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
    @JoinTable(
        name = "room_amenities",
        joinColumns = @JoinColumn(name = "room_id"),
        inverseJoinColumns = @JoinColumn(name = "amenity_id")
    )
    private List<Amenity> amenities = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Helper methods
    public void addImage(RoomImage image) {
        images.add(image);
        image.setRoom(this);
    }

    public void removeImage(RoomImage image) {
        images.remove(image);
        image.setRoom(null);
    }

    public void addAmenity(Amenity amenity) {
        amenities.add(amenity);
        amenity.getRooms().add(this);
    }

    public void removeAmenity(Amenity amenity) {
        amenities.remove(amenity);
        amenity.getRooms().remove(this);
    }

    // Backward compatibility methods
    public Boolean getAvailable() {
        return status == RoomStatus.AVAILABLE;
    }

    public void setAvailable(Boolean available) {
        this.status = available ? RoomStatus.AVAILABLE : RoomStatus.BOOKED;
    }

    public String getType() {
        return roomType != null ? roomType.getName() : null;
    }

    // Convert BigDecimal price to Double for backward compatibility
    public Double getPriceAsDouble() {
        return price != null ? price.doubleValue() : 0.0;
    }

    public void setPriceFromDouble(Double price) {
        this.price = price != null ? BigDecimal.valueOf(price) : BigDecimal.ZERO;
    }
}
