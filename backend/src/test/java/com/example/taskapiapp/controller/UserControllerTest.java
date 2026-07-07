package com.example.taskapiapp.controller;

import com.example.taskapiapp.entity.User;
import com.example.taskapiapp.exception.UserNotFoundException;
import com.example.taskapiapp.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.ArgumentMatchers.any;
import org.springframework.http.MediaType;


@WebMvcTest(UserController.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;


    @Test
    void ユーザーが0件で空のリストが返却されること() throws Exception {
        when(userService.findAll()).thenReturn(List.of());
        mockMvc.perform(get("/users"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    void ユーザー一覧取得でサービス例外が発生した場合は500が返却されること() throws Exception {
        when(userService.findAll()).thenThrow(new RuntimeException("DB Error"));

        mockMvc.perform(get("/users"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void ユーザー作成で201が返却されること() throws Exception {
        // ユーザー作成のテストコードをここに追加

        User user = new User();
        user.setId(1L);
        user.setName("石田");
        user.setEmail("ishida@example.com");

        when(userService.create(any(User.class))).thenReturn(user);

        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "name": "石田",
                                    "email": "ishida@example.com",
                                    "password": "password123"
                                }
                                """))
                .andExpect(status().isCreated());
    }

    @Test
    void ユーザー作成でnameが空の場合は400が返却されること() throws Exception {
        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "name": "",
                                    "email": "ishida@example.com",
                                    "password": "password123"
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void ユーザー作成でemailが空の場合は400が返却されること() throws Exception {
        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "name": "石田",
                                    "email": "",
                                    "password": "password123"
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void ユーザー作成でpasswordが空の場合は400が返却されること() throws Exception {
        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "name": "石田",
                                    "email": "ishida@example.com",
                                    "password": ""
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void ユーザー作成でpasswordが8文字未満のときは400が返却されること() throws Exception {

        String shortPassword = "a".repeat(7);

        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "name": "石田",
                                    "email": "ishida@example.com",
                                    "password": "%s"
                                }
                                """.formatted(shortPassword)))
                .andExpect(status().isBadRequest());

        verify(userService, never()).create(any(User.class));
    }

    @Test
    void ユーザー作成でpasswordが100文字以上のときは400で返却されること() throws Exception {
        String shortPassword = "a".repeat(101);

        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "name": "石田",
                                    "email": "ishida@example.com",
                                    "password": "%s"
                                }
                                """.formatted(shortPassword)))
                .andExpect(status().isBadRequest());

        verify(userService, never()).create(any(User.class));
    }


    @Test
    void ユーザー作成でemailが不正な形式の場合は400が返却されること() throws Exception {
        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "name": "石田",
                                    "email": "aaa",
                                    "password": "password123"
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void 存在するユーザーが取得できること() throws Exception {
        User user = new User();
        user.setId(1L);
        user.setName("石田");
        user.setEmail("ishida@example.com");
        user.setPassword("password123");

        when(userService.findById(1L)).thenReturn(user);

        mockMvc.perform(get("/users/1"))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                        {
                            "id": 1,
                            "name": "石田",
                            "email": "ishida@example.com",
                            "password": "password123"
                        }
                        """));
    }

    @Test
    void ユーザー作成でnameの長さが50文字の場合は201が返却されること() throws Exception {
        String longName = "あ".repeat(50);

        User user = new User();
        user.setId(1L);
        user.setName(longName);
        user.setEmail("ishida@example.com");
        user.setPassword("password123");


        when(userService.create(any(User.class))).thenReturn(user);

        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "name": "%s",
                                    "email": "ishida@example.com",
                                    "password": "password123"
                                }
                                """.formatted(longName)))
                .andExpect(status().isCreated());
    }

    @Test
    void ユーザ作成でnameが51文字の場合は400が返却されること() throws Exception {
        String longName = "あ".repeat(51);

        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "name": "%s",
                                    "email": "ishida@example.com",
                                    "password": "password123"
                                }
                                """.formatted(longName)))
                .andExpect(status().isBadRequest());

        verify(userService, never()).create(any(User.class));
    }


    @Test
    void ユーザー作成でemailが不正な場合は400が返却されること() throws Exception {

        //ドメインを作成する
        String domain = "@example.com";
        String longEmail = "a".repeat(91) + domain;

        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "name": "石田",
                                    "email": "%s",
                                    "password": "password123"
                                }
                                """.formatted(longEmail)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void 存在しないユーザーを取得しようとした場合は404が返却されること() throws Exception {
        when(userService.findById(999L)).thenThrow(new UserNotFoundException(999L));
        mockMvc.perform(get("/users/999"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("User not found with id: 999"));
    }


    @Test
    void ユーザー更新が200で返却されること() throws Exception {

        User user = new User();
        user.setId(1L);
        user.setName("山下");
        user.setEmail("yamashita@example.com");
        user.setPassword("password123");

        when(userService.update(any(Long.class), any(User.class))).thenReturn(user);

        mockMvc.perform(put("/users/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                { "name": "山下",
                                  "email": "yamashita@example.com",
                                  "password": "password123"
                                }"""
                        ))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                        {
                            "id": 1,
                            "name": "山下",
                            "email": "yamashita@example.com",
                            "password": "password123"
                        }
                        """));

        verify(userService).update(any(Long.class), any(User.class));
    }

    @Test
    void ユーザー更新でnameが空の時は400が戻る() throws Exception {
        mockMvc.perform(put("/users/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                { "name": "",
                                  "email": "yamashita@example.com",
                                  "password": "password123"
                                }
                                """))
                .andExpect(status().isBadRequest());
        verify(userService, never()).update(any(Long.class), any(User.class));
    }

    @Test
    void ユーザー更新でemailが空の場合は400が返る() throws Exception {
        mockMvc.perform(put("/users/1")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                            { "name": "山下",
                              "email": "",
                              "password": "password123"
                            }
                            """))
                .andExpect(status().isBadRequest());
        verify(userService, never()).update(any(Long.class), any(User.class));
    }

    @Test
    void ユーザー更新でpasswordが空の場合は400が返る() throws Exception {
        mockMvc.perform(put("/users/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                { "name": "山下",
                                  "email": "yamashita@example.com",
                                  "password":""
                                }
                                """))
                .andExpect(status().isBadRequest());
        verify(userService, never()).update(any(Long.class), any(User.class));
    }

    @Test
    void ユーザー削除で204が返る() throws Exception {
        doNothing().when(userService).delete(1L);

        mockMvc.perform(delete("/users/1"))
                .andExpect(status().isNoContent());

        verify(userService).delete(1L);
    }

    @Test
    void 存在しないユーザー削除では404が返却されること() throws Exception {
        doThrow(new UserNotFoundException(999L))
                .when(userService).delete(999L);

        mockMvc.perform(delete("/users/999"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("User not found with id: 999"));

        verify(userService).delete(999L);
    }
}
