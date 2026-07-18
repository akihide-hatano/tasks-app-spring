package com.example.taskapiapp.service;

import com.example.taskapiapp.dto.request.TaskCreateRequest;
import com.example.taskapiapp.entity.Task;
import com.example.taskapiapp.exception.TaskNotFoundException;
import com.example.taskapiapp.repository.TaskRepository;
import com.example.taskapiapp.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public List<Task> findAll(){
        return taskRepository.findAll();
    }

    public Task findById(Long id){
        return taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException(id));
    }

    public Task create(TaskCreateRequest request){

        Task task = new Task();
        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setStatus(request.status());
        task.setUser(userRepository.findById(request.userId()).orElseThrow(() -> new RuntimeException("User not found")));
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
