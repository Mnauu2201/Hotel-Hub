package com.hotelhub.backend.entity;

import jakarta.persistence.*;
import lombok.*;

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

    @Column(name = "room_number")
    private String roomNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "type_id")
    private RoomType roomType;

    private Double price;

    @Column(name = "status")
    private String status = "available";

    private Integer capacity;

    private String description;

    // Getter cho backward compatibility
    public Boolean getAvailable() {
        return "available".equals(status);
    }

    public void setAvailable(Boolean available) {
        this.status = available ? "available" : "unavailable";
    }

    // Getter cho backward compatibility
    public String getType() {
        return roomType != null ? roomType.getName() : null;
    }
}
