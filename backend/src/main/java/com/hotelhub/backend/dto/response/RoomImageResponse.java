package com.hotelhub.backend.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomImageResponse {

    private Long imageId;
    private Long roomId;
    private String imageUrl;
    private String altText;
    private Boolean isPrimary;
    private Integer displayOrder;
    private Long fileSize;
    private String mimeType;
}
