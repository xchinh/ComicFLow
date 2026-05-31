package com.example.comicflow.user.dto.response;

import com.example.comicflow.user.enums.Role;
import com.example.comicflow.user.enums.UserStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    UUID id;
    String email;
    String username;
    Role role;
    UserStatus userStatus;
}
