package com.example.comicflow.auth.dto.request;

import com.example.comicflow.user.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterRequest {

    @Email
    @NotBlank
    String email;

    @NotBlank
    String username;

    @NotBlank
    String password;

    Role role;
}
