insert into users ( name, password, email) values
 ('suzuki', 'password123', 'suzuki@example.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO task (title, description, user_id)
SELECT
    'ReactでAPIからタスク一覧を取得する',
    'fetchを使ってSpring BootのGET APIを呼び出し、取得したタスクを画面へ表示する。',
    id
FROM users
WHERE email = 'suzuki@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM task
    WHERE title = 'ReactでAPIからタスク一覧を取得する'
);

INSERT INTO task (title, description, user_id)
SELECT
    'タスク登録APIを実装する',
    'Reactの入力フォームからPOSTリクエストを送り、新しいタスクをデータベースへ保存する。',
    id
FROM users
WHERE email = 'suzuki@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM task
    WHERE title = 'タスク登録APIを実装する'
);

INSERT INTO task (title, description, user_id)
SELECT
    'タスク更新機能を実装する',
    '選択したタスクのタイトルと説明を編集し、PUT APIを使って更新内容を保存する。',
    id
FROM users
WHERE email = 'suzuki@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM task
    WHERE title = 'タスク更新機能を実装する'
);

INSERT INTO task (title, description, user_id)
SELECT
    'タスク削除機能を実装する',
    '削除ボタンからDELETE APIを呼び出し、指定したタスクをデータベースから削除する。',
    id
FROM users
WHERE email = 'suzuki@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM task
    WHERE title = 'タスク削除機能を実装する'
);

INSERT INTO task (title, description, user_id)
SELECT
    '入力値のバリデーションを追加する',
    'タイトルや説明が空の場合に登録を拒否し、利用者へ分かりやすいエラーメッセージを表示する。',
    id
FROM users
WHERE email = 'suzuki@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM task
    WHERE title = '入力値のバリデーションを追加する'
);

INSERT INTO task (title, description, user_id)
SELECT
    'API通信のエラー処理を追加する',
    '通信失敗や404、500エラーが発生した場合に、React画面へ適切なエラー内容を表示する。',
    id
FROM users
WHERE email = 'suzuki@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM task
    WHERE title = 'API通信のエラー処理を追加する'
);

INSERT INTO task (title, description, user_id)
SELECT
    'Controllerテストを追加する',
    'MockMvcを使ってGET、POST、PUT、DELETEの正常系と異常系をテストする。',
    id
FROM users
WHERE email = 'suzuki@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM task
    WHERE title = 'Controllerテストを追加する'
);

INSERT INTO task (title, description, user_id)
SELECT
    'GitHub Actionsで自動テストを実行する',
    'GitHubへコードをpushした際にGradleテストが自動実行されるCI環境を整備する。',
    id
FROM users
WHERE email = 'suzuki@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM task
    WHERE title = 'GitHub Actionsで自動テストを実行する'
);

INSERT INTO task (title, description, user_id)
SELECT
    'アプリケーションをRenderへデプロイする',
    'Spring BootアプリケーションをRenderへ公開し、外部からAPIを利用できる状態にする。',
    id
FROM users
WHERE email = 'suzuki@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM task
    WHERE title = 'アプリケーションをRenderへデプロイする'
);

INSERT INTO task (title, description, user_id)
SELECT
    'PostgreSQLをSupabaseへ移行する',
    'RenderのデータベースからSupabase PostgreSQLへ接続先を変更し、長期運用できる構成にする。',
    id
FROM users
WHERE email = 'suzuki@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM task
    WHERE title = 'PostgreSQLをSupabaseへ移行する'
);