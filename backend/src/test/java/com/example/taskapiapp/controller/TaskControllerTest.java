package com.example.taskapiapp.controller;

import com.example.taskapiapp.entity.Task;
import com.example.taskapiapp.exception.TaskNotFoundException;
import com.example.taskapiapp.service.TaskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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

        mockMvc.perform(get("/tasks"))
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
        mockMvc.perform(get("/tasks"))
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

        mockMvc.perform(get("/tasks/1"))
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

        mockMvc.perform(get("/tasks/1"))
                .andExpect(status().isNotFound());
        verify(taskService).findById(1L);
    }

}
