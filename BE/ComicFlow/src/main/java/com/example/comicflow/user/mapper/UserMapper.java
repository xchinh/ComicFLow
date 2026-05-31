package com.example.comicflow.user.mapper;

import com.example.comicflow.user.dto.response.UserResponse;
import com.example.comicflow.user.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserResponse toResponse(User user);
}
