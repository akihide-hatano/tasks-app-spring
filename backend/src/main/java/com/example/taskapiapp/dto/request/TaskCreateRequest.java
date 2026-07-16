package com.example.taskapiapp.dto.request;


import com.example.taskapiapp.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

//request画面から送られてくるデータを受け取るためのクラス
public record TaskCreateRequest (

    @NotBlank(message = "タイトルは必須です")
    @Size(max = 100, message = "タイトルは100文字以内で入力してください")
    String title,

    @NotBlank(message = "説明は必須です")
    @Size(max = 500, message = "説明は500文字以内で入力してください")
    String description,

    @NotNull(message = "ステータスは必須です")
    TaskStatus status,

    @NotNull(message = "ユーザーIDは必須です")
    Long userId
) {}

