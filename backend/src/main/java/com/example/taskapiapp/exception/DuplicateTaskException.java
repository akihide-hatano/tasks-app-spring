package com.example.taskapiapp.exception;

public class DuplicateTaskException extends RuntimeException {

    public DuplicateTaskException(String title) {
        super("Duplicate task found: " + title);
    }
}
