package com.example.taskapiapp.exception;

public class DuplicateEmailException extends RuntimeException {

    public DuplicateEmailException(String email) {
        super("Duplicate email found: " + email);
    }
}
