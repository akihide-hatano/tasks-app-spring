package com.example.taskapiapp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Controller

import java.util.List;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    @GetMapping(tasks)
    public String getTaks(){
        return "tasks";
    }

    @GetMapping(tasks/{id})
        public　String getTasksId(@PathVariable Long id){
            return "tasks";
    }

    @PostMapping(tasks/new)
       public String postTasksNew(){
           return "tasks/new";
       }

   @PutMapping(tasks/{id}/edit)
    public String postPutid(@PathVariable Lomg id){
        return "tasks/edit";
    }

    @DeleteMapping(tasks/{id}/delete)
    public String deleteId(@PathVariable Long id){
        return "tasks/delete";
    }
}
