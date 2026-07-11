package com.example.taskapiapp.service;

import com.example.taskapiapp.entity.Task;
import com.example.taskapiapp.exception.TaskNotFoundException;
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
        return taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException(id));
    }

    public Task create(Task task){
        return taskRepository.save(task);
    }

    public Task update(Long id, Task task){

        Task existingTask = taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException(id));

        existingTask.setTitle(task.getTitle());
        existingTask.setDescription(task.getDescription());

        return taskRepository.save(existingTask);
    }

    public void delete(Long id){

        Task   existingTask= taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException(id));
        taskRepository.delete(existingTask);
    }

}
