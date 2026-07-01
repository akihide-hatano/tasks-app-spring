package com.example.taskapiapp.exception;

public class TaskNotFoundException extends RuntimeException {

    public TaskNotFoundException(Long id) {
        super("Task not found. id = " + id);
    }
}
