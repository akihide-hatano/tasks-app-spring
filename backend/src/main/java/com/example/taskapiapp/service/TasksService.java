package com.example.taskapiapp.service;

import com.example.taskapiapp.entity.Task;
import com.example.taskapiapp.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TasksService {

    private final TaskRepository taskRepository;

    public TasksService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> findAll(){
        return taskRepository.findAll();
    }

    public Task findById(Long id){
        return taskRepository.findById(id).orElse(null);
    }

    public Task create(Task task){
        return taskRepository.save(task);
    }

    public void delete(Long id){
        taskRepository.deleteById(id);
    }

}
