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
        //POSTメソッドで飛んできたrequest内容確認
        System.out.println("=== Task登録処理 ===");
        System.out.println("title :" + request.title());
        System.out.println("description :" + request.description());
        System.out.println("status :" + request.status());
        System.out.println("userId :" + request.userId());

        //新しくリクエスト内容を保存してEntityへセットする
        //Setterを使ってtaskに値をセットする。そのためにEntityはSetterを使用。
        Task task = new Task();
        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setStatus(request.status());

        //Userは存在しているか確認してsetUserを行う。
        task.setUser(userRepository.findById(request.userId()).orElseThrow(() -> new RuntimeException("User not found")));

        //POSTメソッドで飛んできたrequest内容確認
        System.out.println("=== Task保存前 ===");
        System.out.println("title :" + task.getTitle());
        System.out.println("description :" + task.getDescription());
        System.out.println("status :" + task.getStatus());
        System.out.println("userId :" + task.getUser().getId());

        return taskRepository.save(task);
    }

    public Task update(Long id, Task task){

        Task existingTask = taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException(id));

        existingTask.setTitle(task.getTitle());
        existingTask.setDescription(task.getDescription());
        existingTask.setStatus(task.getStatus());

        return taskRepository.save(existingTask);
    }

    public void delete(Long id){

        Task   existingTask= taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException(id));
        taskRepository.delete(existingTask);
    }

}
