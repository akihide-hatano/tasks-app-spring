package com.example.taskapiapp.controller;

import com.example.taskapiapp.dto.request.TaskCreateRequest;
import com.example.taskapiapp.entity.Task;
import com.example.taskapiapp.exception.TaskNotFoundException;
import com.example.taskapiapp.service.TaskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TaskController.class)
public class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private TaskService taskService;

    @Test
    void タスクが0件の場合は空のリストが返却される() throws Exception {
        when(taskService.findAll()).thenReturn(List.of());

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));

        verify(taskService).findAll();
    }

    @Test
    void タスクが2件存在する場合は200OKと一覧が返却される() throws Exception {

        Task task1 = new Task();
        task1.setId(1L);
        task1.setTitle("Task 1");
        task1.setDescription("Description 1");

        Task task2 = new Task();
        task2.setId(2L);
        task2.setTitle("Task 2");
        task2.setDescription("Description 2");

        when(taskService.findAll()).thenReturn(List.of(task1,task2));
        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                        .andExpect(
                                content().json("""
                                        [
                                            {
                                                "id": 1,
                                                "title": "Task 1",
                                                "description": "Description 1"
                                            },
                                            {
                                                "id": 2,
                                                "title": "Task 2",
                                                "description": "Description 2"
                                            }
                                        ]
                                        """));
        verify(taskService).findAll();
    }

    @Test
    void 指定したIDのタスクが存在する場合は200とタスクが返却される() throws Exception {

        Task task1 = new Task();
        task1.setId(1L);
        task1.setTitle("Task 1");
        task1.setDescription("Description 1");

        when(taskService.findById(1L)).thenReturn(task1);

        mockMvc.perform(get("/api/tasks/1"))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                        {
                            "id": 1,
                            "title": "Task 1",
                            "description": "Description 1"
                        }
                        """));
        verify(taskService).findById(1L);
    }

    @Test
    void 指定したIDのタスクが存在しない場合は404が返却される() throws Exception {
        when(taskService.findById(1L)).thenThrow(new TaskNotFoundException(1L));

        mockMvc.perform(get("/api/tasks/1"))
                .andExpect(status().isNotFound());
        verify(taskService).findById(1L);
    }

    @Test
    void タスクを登録すると201が返却されタスクが登路される()throws Exception{

        Task task1 = new Task();
        task1.setId(1L);
        task1.setTitle("Task 1");
        task1.setDescription("Description 1");

        when(taskService.create(any(TaskCreateRequest.class))).thenReturn(task1);

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "title": "Task 1",
                                    "description": "Description 1"
                                }
                                """))
                .andExpect(status().isCreated());
    }


    @Test
    void タスクを登録する際にタイトルが空の場合は400が返却される()throws Exception{

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "title": "",
                                    "description": "Description 1"
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void タスクを登録する際に説明文が空の場合は400が返却される()throws Exception{

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "title": "Task 1",
                                    "description": ""
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void タスクが登録されているものを変更した場合200が返却される()throws Exception{

        Task updateTask = new Task();
        updateTask.setId(1L);
        updateTask.setTitle("Task Update");
        updateTask.setDescription("Description Update");

        when(taskService.update(any(Long.class), any(Task.class))).thenReturn(updateTask);

        mockMvc.perform(put("/api/tasks/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "title": "Task Update",
                                    "description": "Description Update"
                                }
                                """))
                .andExpect(status().isOk());
        }

        @Test
    void タスク登録されていないものを変更した場合は404が返却される()throws Exception{

        when(taskService.update(any(Long.class), any(Task.class))).thenThrow(new TaskNotFoundException(1L));

        mockMvc.perform(put("/api/tasks/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "title": "Task Update",
                                    "description": "Description Update"
                                }
                                """))
                .andExpect(status().isNotFound());
    }

    @Test
    void タスクが登録されているものを更新したが空のtitleを指定した場合は400が返却される()throws Exception{

        mockMvc.perform(put("/api/tasks/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "title": "",
                                    "description": "Description Update"
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void タスクが登録されているものを削除すると204を返す() throws Exception{

        mockMvc.perform(delete("/api/tasks/1"))
                .andExpect(status().isNoContent());

        verify(taskService).delete(1L);
    }

    @Test
    void タスクが登録されていないものを削除すると404を返す() throws Exception {

        doThrow(new TaskNotFoundException(1L))
                .when(taskService).delete(1L);

        mockMvc.perform(delete("/api/tasks/1"))
                .andExpect(status().isNotFound());

        verify(taskService).delete(1L);
    }

}
