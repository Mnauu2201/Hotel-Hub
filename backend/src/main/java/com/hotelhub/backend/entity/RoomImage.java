package com.hotelhub.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "room_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomImage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id")
    private Long imageId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;
    
    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;
    
    @Column(name = "alt_text", length = 200)
    private String altText;
    
    @Column(name = "is_primary")
    private Boolean isPrimary = false;
    
    @Column(name = "display_order")
    private Integer displayOrder = 0;
    
    @Column(name = "file_size")
    private Long fileSize;
    
    @Column(name = "mime_type", length = 100)
    private String mimeType;
}