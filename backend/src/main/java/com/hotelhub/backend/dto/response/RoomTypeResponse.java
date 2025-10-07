package com.hotelhub.backend.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomTypeResponse {

    private Long typeId;
    private String name;
    private String description;
    private LocalDateTime createdAt;
}
