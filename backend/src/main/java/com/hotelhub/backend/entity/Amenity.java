package com.hotelhub.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "amenities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Amenity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "amenity_id")
    private Long amenityId;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(length = 50)
    private String icon;
    
    @ManyToMany(mappedBy = "amenities")
    private List<Room> rooms = new ArrayList<>();
    
    // Helper methods
    public void addRoom(Room room) {
        rooms.add(room);
        room.getAmenities().add(this);
    }
    
    public void removeRoom(Room room) {
        rooms.remove(room);
        room.getAmenities().remove(this);
    }
}