package com.hotelhub.backend.entity;

public enum RoomStatus {
    AVAILABLE("available"),
    LOCKED("locked"),
    BOOKED("booked"),
    MAINTENANCE("maintenance");
    
    private final String value;
    
    RoomStatus(String value) {
        this.value = value;
    }
    
    public String getValue() {
        return value;
    }
    
    public static RoomStatus fromValue(String value) {
        for (RoomStatus status : RoomStatus.values()) {
            if (status.value.equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown room status: " + value);
    }
}

