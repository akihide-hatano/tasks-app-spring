package com.example.taskapiapp.service;

import com.example.taskapiapp.entity.Task;
import com.example.taskapiapp.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
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

    public Task update(Long id, Task task){

        Task exsistingTask = taskRepository.findById(id).orElse(null);
        if(exsistingTask == null){
            return null;
        }

        exsistingTask.setId(id);
        exsistingTask.setTitle(task.getTitle());
        exsistingTask.setDescription(task.getDescription());

        return taskRepository.save(exsistingTask);
    }

    public void delete(Long id){
        taskRepository.deleteById(id);
    }

}
