package com.hotelhub.backend.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmenityResponse {

    private Long amenityId;
    private String name;
    private String description;
    private String icon;
}
