package com.example.taskapiapp.exception;

public class ValidationException extends RuntimeException {
    public ValidationException(String message){
    super(message);
    }
}
