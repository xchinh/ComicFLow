package com.example.comicflow.user.controller;

import com.example.comicflow.common.utils.Utils;
import com.example.comicflow.purchase.service.IPurchaseService;
import com.example.comicflow.security.JwtService;
import com.example.comicflow.user.dto.response.UserResponse;
import com.example.comicflow.user.entity.User;
import com.example.comicflow.user.service.IUserService;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IUserService userService;

    @MockBean
    private IPurchaseService purchaseService;

    @MockBean
    private JwtService jwtService;

    @Test
    @WithMockUser
    void getMyInfo_ReturnsUserResponse() throws Exception {
        UUID userId = UUID.randomUUID();
        User user = User.builder().id(userId).username("testuser").build();
        UserResponse userResponse = UserResponse.builder().id(userId).username("testuser").build();

        try (MockedStatic<Utils> mockedUtils = mockStatic(Utils.class)) {
            mockedUtils.when(Utils::getCurrentUser).thenReturn(user);
            when(userService.getUserInfo(userId)).thenReturn(userResponse);

            mockMvc.perform(get("/users/me")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.username").value("testuser"));
        }
    }
}
