package com.example.taskapiapp.service;

import com.example.taskapiapp.entity.User;
import com.example.taskapiapp.exception.DuplicateEmailException;
import com.example.taskapiapp.exception.UserNotFoundException;
import com.example.taskapiapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> findAll(){
        return userRepository.findAll();
    }

    public User findById(Long id){
        return userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));
    }

    public User create(User user){
        return userRepository.save(user);
    }

    public User update(Long id, User user){
        User existingUser = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));

        //userのemailをチェックしておく
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new DuplicateEmailException(user.getEmail());
        }

        existingUser.setName(user.getName());
        existingUser.setEmail(user.getEmail());
        return userRepository.save(existingUser);
    }

    public void delete(Long id){
        User existingUser = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));
        userRepository.delete(existingUser);
    }
}

