package com.example.comicflow.user.mapper;

import com.example.comicflow.auth.dto.request.RegisterRequest;
import com.example.comicflow.user.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);
}
